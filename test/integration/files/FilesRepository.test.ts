import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { registerFileViaApi, uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  FileSearchCriteria,
  FileAccessStatus,
  FileOrderCriteria
} from '../../../src/files/domain/models/FileCriteria'
import {
  DatasetNotNumberedVersion,
  Dataset,
  CreatedDatasetIdentifiers,
  createDataset
} from '../../../src/datasets'
import { File } from '../../../src/files/domain/models/File'
import { FileCounts } from '../../../src/files/domain/models/FileCounts'
import { FileDownloadSizeMode } from '../../../src'
import {
  deaccessionDatasetViaApi,
  publishDatasetViaApi,
  waitForNoLocks,
  deletePublishedDatasetViaApi
} from '../../testHelpers/datasets/datasetHelper'

describe('FilesRepository', () => {
  const sut: FilesRepository = new FilesRepository()

  let testDatasetIds: CreatedDatasetIdentifiers

  const testTextFile1Name = 'test-file-1.txt'
  const testTextFile2Name = 'test-file-2.txt'
  const testTextFile3Name = 'test-file-3.txt'
  const testTabFile4Name = 'test-file-4.tab'
  const testCategoryName = 'testCategory'

  const nonExistentFiledId = 200

  const latestDatasetVersionId = DatasetNotNumberedVersion.LATEST

  let testFileId: number
  let testFilePersistentId: string

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    try {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    } catch (error) {
      throw new Error('Tests beforeAll(): Error while creating test dataset')
    }
    // Uploading test file 1 with some categories
    const uploadFileResponse = await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name, {
      categories: [testCategoryName]
    }).catch(() => {
      throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile1Name}`)
    })
    // Uploading test file 2
    await uploadFileViaApi(testDatasetIds.numericId, testTextFile2Name).catch(() => {
      throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile2Name}`)
    })
    // Uploading test file 3
    await uploadFileViaApi(testDatasetIds.numericId, testTextFile3Name).catch(() => {
      throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile3Name}`)
    })
    // Uploading test file 4
    await uploadFileViaApi(testDatasetIds.numericId, testTabFile4Name).catch(() => {
      throw new Error(`Tests beforeAll(): Error while uploading file ${testTabFile4Name}`)
    })
    // Registering test file 1

    await registerFileViaApi(uploadFileResponse.data.data.files[0].dataFile.id).catch(() => {
      throw new Error(`Tests beforeAll(): Error while registering file ${testTextFile1Name}`)
    })
    const filesSubset = await sut.getDatasetFiles(
      testDatasetIds.numericId,
      latestDatasetVersionId,
      false,
      FileOrderCriteria.NAME_AZ
    )
    testFileId = filesSubset.files[0].id
    testFilePersistentId = filesSubset.files[0].persistentId
  })

  afterAll(async () => {
    try {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    } catch (error) {
      throw new Error('Tests afterAll(): Error while deleting test dataset')
    }
  })

  describe('getDatasetFiles', () => {
    const testFileCriteria = new FileSearchCriteria()
      .withContentType('text/plain')
      .withAccessStatus(FileAccessStatus.PUBLIC)

    describe('by numeric id', () => {
      test('should return all files filtering by dataset id and version id', async () => {
        const actual = await sut.getDatasetFiles(
          testDatasetIds.numericId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ
        )

        expect(actual.files).toHaveLength(4)
        expect(actual.files[0].name).toBe(testTextFile1Name)
        expect(actual.files[1].name).toBe(testTextFile2Name)
        expect(actual.files[2].name).toBe(testTextFile3Name)
        expect(actual.files[3].name).toBe(testTabFile4Name)
        expect(actual.totalFilesCount).toBe(4)
      })

      test('should return correct files filtering by dataset id, version id, and paginating', async () => {
        const actual = await sut.getDatasetFiles(
          testDatasetIds.numericId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ,
          3,
          3,
          undefined
        )

        expect(actual.files).toHaveLength(1)
        expect(actual.files[0].name).toBe(testTabFile4Name)
        expect(actual.totalFilesCount).toBe(4)
      })

      test('should return correct files filtering by dataset id, version id, and applying newest file criteria', async () => {
        const actual = await sut.getDatasetFiles(
          testDatasetIds.numericId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NEWEST,
          undefined,
          undefined,
          testFileCriteria
        )

        expect(actual.files).toHaveLength(3)
        expect(actual.files[0].name).toBe(testTextFile3Name)
        expect(actual.files[1].name).toBe(testTextFile2Name)
        expect(actual.files[2].name).toBe(testTextFile1Name)
        expect(actual.totalFilesCount).toBe(3)
      })

      test('should return error when dataset does not exist', async () => {
        const nonExistentTestDatasetId = 100
        const errorExpected: ReadError = new ReadError(
          `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
        )

        await expect(
          sut.getDatasetFiles(
            nonExistentTestDatasetId,
            latestDatasetVersionId,
            false,
            FileOrderCriteria.NAME_AZ
          )
        ).rejects.toThrow(errorExpected)
      })
    })

    describe('by persistent id', () => {
      test('should return all files filtering by persistent id and version id', async () => {
        const actual = await sut.getDatasetFiles(
          testDatasetIds.persistentId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ
        )

        expect(actual.files).toHaveLength(4)
        expect(actual.files[0].name).toBe(testTextFile1Name)
        expect(actual.files[1].name).toBe(testTextFile2Name)
        expect(actual.files[2].name).toBe(testTextFile3Name)
        expect(actual.files[3].name).toBe(testTabFile4Name)
        expect(actual.totalFilesCount).toBe(4)
      })

      test('should return correct files filtering by persistent id, version id, and paginating', async () => {
        const actual = await sut.getDatasetFiles(
          testDatasetIds.persistentId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NAME_AZ,
          3,
          3,
          undefined
        )

        expect(actual.files).toHaveLength(1)
        expect(actual.files[0].name).toBe(testTabFile4Name)
        expect(actual.totalFilesCount).toBe(4)
      })

      test('should return correct files filtering by persistent id, version id, and applying newest file criteria', async () => {
        const actual = await sut.getDatasetFiles(
          testDatasetIds.persistentId,
          latestDatasetVersionId,
          false,
          FileOrderCriteria.NEWEST,
          undefined,
          undefined,
          testFileCriteria
        )

        expect(actual.files).toHaveLength(3)
        expect(actual.files[0].name).toBe(testTextFile3Name)
        expect(actual.files[1].name).toBe(testTextFile2Name)
        expect(actual.files[2].name).toBe(testTextFile1Name)
        expect(actual.totalFilesCount).toBe(3)
      })

      test('should return error when dataset does not exist', async () => {
        const testWrongPersistentId = 'wrongPersistentId'
        const errorExpected = new ReadError(
          `[404] Dataset with Persistent ID ${testWrongPersistentId} not found.`
        )

        await expect(
          sut.getDatasetFiles(
            testWrongPersistentId,
            latestDatasetVersionId,
            false,
            FileOrderCriteria.NAME_AZ
          )
        ).rejects.toThrow(errorExpected)
      })
    })
  })

  describe('getDatasetFileCounts', () => {
    const expectedFileCounts: FileCounts = {
      total: 4,
      perContentType: [
        {
          contentType: 'text/plain',
          count: 3
        },
        {
          contentType: 'text/tab-separated-values',
          count: 1
        }
      ],
      perAccessStatus: [
        {
          accessStatus: FileAccessStatus.PUBLIC,
          count: 4
        }
      ],
      perCategoryName: [
        {
          categoryName: testCategoryName,
          count: 1
        }
      ]
    }

    test('should return file count filtering by numeric id', async () => {
      const actual = await sut.getDatasetFileCounts(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false
      )

      expect(actual.total).toBe(expectedFileCounts.total)
      expect(actual.perContentType).toEqual(
        expect.arrayContaining(expectedFileCounts.perContentType)
      )
      expect(actual.perAccessStatus).toEqual(expectedFileCounts.perAccessStatus)
      expect(actual.perCategoryName).toEqual(expectedFileCounts.perCategoryName)
    })

    test('should return file count filtering by numeric id and applying category criteria', async () => {
      const expectedFileCountsForCriteria: FileCounts = {
        total: 1,
        perContentType: [
          {
            contentType: 'text/plain',
            count: 1
          }
        ],
        perAccessStatus: [
          {
            accessStatus: FileAccessStatus.PUBLIC,
            count: 1
          }
        ],
        perCategoryName: [
          {
            categoryName: testCategoryName,
            count: 1
          }
        ]
      }
      const testCriteria = new FileSearchCriteria().withCategoryName(testCategoryName)
      const actual = await sut.getDatasetFileCounts(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        testCriteria
      )

      expect(actual.total).toBe(expectedFileCountsForCriteria.total)
      expect(actual.perContentType).toEqual(expectedFileCountsForCriteria.perContentType)
      expect(actual.perAccessStatus).toEqual(expectedFileCountsForCriteria.perAccessStatus)
      expect(actual.perCategoryName).toEqual(expectedFileCountsForCriteria.perCategoryName)
    })

    test('should return file count filtering by persistent id', async () => {
      const actual = await sut.getDatasetFileCounts(
        testDatasetIds.persistentId,
        latestDatasetVersionId,
        false
      )

      expect(actual.total).toBe(expectedFileCounts.total)
      expect(actual.perContentType).toEqual(
        expect.arrayContaining(expectedFileCounts.perContentType)
      )
      expect(actual.perAccessStatus).toEqual(expectedFileCounts.perAccessStatus)
      expect(actual.perCategoryName).toEqual(expectedFileCounts.perCategoryName)
    })
  })

  describe('getDatasetFilesTotalDownloadSize', () => {
    const expectedTotalDownloadSize = 193 // 193 bytes

    test('should return total download size filtering by numeric id and ignoring original tabular size', async () => {
      const actual = await sut.getDatasetFilesTotalDownloadSize(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileDownloadSizeMode.ORIGINAL
      )
      expect(actual).toBe(expectedTotalDownloadSize)
    })

    test('should return total download size filtering by persistent id and ignoring original tabular size', async () => {
      const actual = await sut.getDatasetFilesTotalDownloadSize(
        testDatasetIds.persistentId,
        latestDatasetVersionId,
        false,
        FileDownloadSizeMode.ORIGINAL
      )
      expect(actual).toBe(expectedTotalDownloadSize)
    })

    test('should return total download size filtering by numeric id, ignoring original tabular size and applying category criteria', async () => {
      const expectedTotalDownloadSizeForCriteria = 12 // 12 bytes
      const testCriteria = new FileSearchCriteria().withCategoryName(testCategoryName)
      const actual = await sut.getDatasetFilesTotalDownloadSize(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileDownloadSizeMode.ORIGINAL,
        testCriteria
      )
      expect(actual).toBe(expectedTotalDownloadSizeForCriteria)
    })
  })

  describe('getFileDownloadCount', () => {
    test('should return count filtering by file id and version id', async () => {
      const currentTestFilesSubset = await sut.getDatasetFiles(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ
      )
      const testFile = currentTestFilesSubset.files[0]
      const actual = await sut.getFileDownloadCount(testFile.id)
      expect(actual).toBe(0)
    })

    test('should return error when file does not exist', async () => {
      const expectedError = new ReadError(`[404] File with ID ${nonExistentFiledId} not found.`)

      await expect(sut.getFileDownloadCount(nonExistentFiledId)).rejects.toThrow(expectedError)
    })
  })

  describe('getFileUserPermissions', () => {
    test('should return user permissions filtering by file id and version id', async () => {
      const currentTestFilesSubset = await sut.getDatasetFiles(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ
      )
      const testFile = currentTestFilesSubset.files[0]
      const actual = await sut.getFileUserPermissions(testFile.id)

      expect(actual.canDownloadFile).toBe(true)
      expect(actual.canManageFilePermissions).toBe(true)
      expect(actual.canEditOwnerDataset).toBe(true)
    })

    test('should return error when file does not exist', async () => {
      const errorExpected = new ReadError(`[404] File with ID ${nonExistentFiledId} not found.`)

      await expect(sut.getFileUserPermissions(nonExistentFiledId)).rejects.toThrow(errorExpected)
    })
  })

  describe('getFileDataTables', () => {
    test('should return data tables filtering by tabular file id and version id', async () => {
      const currentTestFilesSubset = await sut.getDatasetFiles(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ
      )
      const testFile = currentTestFilesSubset.files[3]
      const actual = await sut.getFileDataTables(testFile.id)
      expect(actual[0].varQuantity).toBe(3)
    })

    test('should return error when file is not tabular and version id', async () => {
      const currentTestFilesSubset = await sut.getDatasetFiles(
        testDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ
      )
      const testFile = currentTestFilesSubset.files[0]

      const errorExpected = new ReadError(
        '[400] This operation is only available for tabular files.'
      )

      await expect(sut.getFileDataTables(testFile.id)).rejects.toThrow(errorExpected)
    })

    test('should return error when file does not exist', async () => {
      const errorExpected = new ReadError('[404] File not found for given id.')

      await expect(sut.getFileDataTables(nonExistentFiledId)).rejects.toThrow(errorExpected)
    })
  })

  describe('getFile', () => {
    describe('by numeric id', () => {
      test('should return file when providing a valid id', async () => {
        const actual: File = (await sut.getFile(
          testFileId,
          DatasetNotNumberedVersion.LATEST,
          false
        )) as File

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file draft when providing a valid id and version is draft', async () => {
        const actual: File = (await sut.getFile(
          testFileId,
          DatasetNotNumberedVersion.DRAFT,
          false
        )) as File

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file and dataset when providing id, version, and returnDatasetVersion is true', async () => {
        const actual = (await sut.getFile(testFileId, DatasetNotNumberedVersion.DRAFT, true)) as [
          File,
          Dataset
        ]

        expect(actual[0].name).toBe(testTextFile1Name)
        expect(actual[1].id).toBe(testDatasetIds.numericId)
      })

      test('should return error when file does not exist', async () => {
        const expectedError = new ReadError(`[404] File with ID ${nonExistentFiledId} not found.`)

        await expect(
          sut.getFile(nonExistentFiledId, DatasetNotNumberedVersion.LATEST, false)
        ).rejects.toThrow(expectedError)
      })
    })
    describe('by persistent id', () => {
      test('should return file when providing a valid persistent id', async () => {
        const actual = (await sut.getFile(
          testFilePersistentId,
          DatasetNotNumberedVersion.LATEST,
          false
        )) as File

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file draft when providing a valid persistent id and version is draft', async () => {
        const actual = (await sut.getFile(
          testFilePersistentId,
          DatasetNotNumberedVersion.DRAFT,
          false
        )) as File

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return error when file does not exist', async () => {
        const nonExistentFiledPersistentId = 'nonExistentFiledPersistentId'
        const expectedError = new ReadError(
          `[404] Datafile with Persistent ID ${nonExistentFiledPersistentId} not found.`
        )

        await expect(
          sut.getFile(nonExistentFiledPersistentId, DatasetNotNumberedVersion.LATEST, false)
        ).rejects.toThrow(expectedError)
      })
    })
  })

  describe('getFileCitation', () => {
    test('should return citation when file exists', async () => {
      const actualFileCitation = await sut.getFileCitation(
        testFileId,
        DatasetNotNumberedVersion.LATEST,
        false
      )

      expect(typeof actualFileCitation).toEqual(expect.any(String))
    })

    test('should return citation when dataset is deaccessioned', async () => {
      await publishDatasetViaApi(testDatasetIds.numericId).catch(() => {
        throw new Error('Error while publishing test Dataset')
      })

      await waitForNoLocks(testDatasetIds.numericId, 10).catch(() => {
        throw new Error('Error while waiting for no locks')
      })

      await deaccessionDatasetViaApi(testDatasetIds.numericId, '1.0').catch(() => {
        throw new Error('Error while deaccessioning test Dataset')
      })

      const actualFileCitation = await sut.getFileCitation(
        testFileId,
        DatasetNotNumberedVersion.LATEST,
        true
      )

      expect(typeof actualFileCitation).toEqual(expect.any(String))
    })

    test('should return error when file does not exist', async () => {
      const errorExpected = new ReadError(`[404] File with ID ${nonExistentFiledId} not found.`)

      await expect(
        sut.getFileCitation(nonExistentFiledId, DatasetNotNumberedVersion.LATEST, false)
      ).rejects.toThrow(errorExpected)
    })
  })
})
