import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { registerFileViaApi, uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  FileSearchCriteria,
  FileAccessStatus,
  FileOrderCriteria
} from '../../../src/files/domain/models/FileCriteria'
import { DatasetNotNumberedVersion } from '../../../src/datasets'
import { FileCounts } from '../../../src/files/domain/models/FileCounts'
import { FileDownloadSizeMode } from '../../../src'

describe('FilesRepository', () => {
  const sut: FilesRepository = new FilesRepository()

  const testTextFile1Name = 'test-file-1.txt'
  const testTextFile2Name = 'test-file-2.txt'
  const testTextFile3Name = 'test-file-3.txt'
  const testTabFile4Name = 'test-file-4.tab'
  const testCategoryName = 'testCategory'

  const nonExistentFiledId = 200

  const latestDatasetVersionId = DatasetNotNumberedVersion.LATEST

  const datasetRepository = new DatasetsRepository()

  let testFileId: number
  let testFilePersistentId: string
  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    // Uploading test file 1 with some categories
    const uploadFileResponse = await uploadFileViaApi(
      TestConstants.TEST_CREATED_DATASET_1_ID,
      testTextFile1Name,
      { categories: [testCategoryName] }
    )
      .then()
      .catch((e) => {
        console.log(e)
        throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile1Name}`)
      })
    // Uploading test file 2
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_1_ID, testTextFile2Name)
      .then()
      .catch((e) => {
        console.log(e)
        throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile2Name}`)
      })
    // Uploading test file 3
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_1_ID, testTextFile3Name)
      .then()
      .catch((e) => {
        console.log(e)
        throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile3Name}`)
      })
    // Uploading test file 4
    await uploadFileViaApi(TestConstants.TEST_CREATED_DATASET_1_ID, testTabFile4Name)
      .then()
      .catch((e) => {
        console.log(e)
        throw new Error(`Tests beforeAll(): Error while uploading file ${testTabFile4Name}`)
      })
    // Registering test file 1
    await registerFileViaApi(uploadFileResponse.data.data.files[0].dataFile.id)
    const filesSubset = await sut.getDatasetFiles(
      TestConstants.TEST_CREATED_DATASET_1_ID,
      latestDatasetVersionId,
      false,
      FileOrderCriteria.NAME_AZ
    )
    testFileId = filesSubset.files[0].id
    testFilePersistentId = filesSubset.files[0].persistentId
  })

  describe('getDatasetFiles', () => {
    const testFileCriteria = new FileSearchCriteria()
      .withContentType('text/plain')
      .withAccessStatus(FileAccessStatus.PUBLIC)

    describe('by numeric id', () => {
      test('should return all files filtering by dataset id and version id', async () => {
        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_CREATED_DATASET_1_ID,
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
          TestConstants.TEST_CREATED_DATASET_1_ID,
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
          TestConstants.TEST_CREATED_DATASET_1_ID,
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
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false
        )
        const actual = await sut.getDatasetFiles(
          testDataset.persistentId,
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
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false
        )
        const actual = await sut.getDatasetFiles(
          testDataset.persistentId,
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
        const testDataset = await datasetRepository.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestDatasetVersionId,
          false
        )
        const actual = await sut.getDatasetFiles(
          testDataset.persistentId,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
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
      const testDataset = await datasetRepository.getDataset(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false
      )
      const actual = await sut.getDatasetFileCounts(
        testDataset.persistentId,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false,
        FileDownloadSizeMode.ORIGINAL
      )
      expect(actual).toBe(expectedTotalDownloadSize)
    })

    test('should return total download size filtering by persistent id and ignoring original tabular size', async () => {
      const testDataset = await datasetRepository.getDataset(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestDatasetVersionId,
        false
      )
      const actual = await sut.getDatasetFilesTotalDownloadSize(
        testDataset.persistentId,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
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
        TestConstants.TEST_CREATED_DATASET_1_ID,
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
        const actual = await sut.getFile(testFileId, DatasetNotNumberedVersion.LATEST)

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file draft when providing a valid id and version is draft', async () => {
        const actual = await sut.getFile(testFileId, DatasetNotNumberedVersion.DRAFT)

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return Not Implemented Yet error when when providing a valid id and version is different than latest and draft', async () => {
        // This tests can be removed once the API supports getting a file by version
        const errorExpected = new ReadError(
          `Requesting a file by its dataset version is not yet supported. Requested version: 1.0. Please try using the :latest or :draft version instead.`
        )

        await expect(sut.getFile(testFileId, '1.0')).rejects.toThrow(errorExpected)
      })

      test('should return error when file does not exist', async () => {
        const errorExpected = new ReadError(`[400] Error attempting get the requested data file.`)

        await expect(
          sut.getFile(nonExistentFiledId, DatasetNotNumberedVersion.LATEST)
        ).rejects.toThrow(errorExpected)
      })
    })
    describe('by persistent id', () => {
      test('should return file when providing a valid persistent id', async () => {
        const actual = await sut.getFile(testFilePersistentId, DatasetNotNumberedVersion.LATEST)

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file draft when providing a valid persistent id and version is draft', async () => {
        const actual = await sut.getFile(testFilePersistentId, DatasetNotNumberedVersion.DRAFT)

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return Not Implemented Yet error when when providing a valid persistent id and version is different than latest and draft', async () => {
        // This tests can be removed once the API supports getting a file by version
        const errorExpected = new ReadError(
          `Requesting a file by its dataset version is not yet supported. Requested version: 1.0. Please try using the :latest or :draft version instead.`
        )

        await expect(sut.getFile(testFilePersistentId, '1.0')).rejects.toThrow(errorExpected)
      })

      test('should return error when file does not exist', async () => {
        const errorExpected = new ReadError(`[400] Error attempting get the requested data file.`)

        const nonExistentFiledPersistentId = 'nonExistentFiledPersistentId'

        await expect(
          sut.getFile(nonExistentFiledPersistentId, DatasetNotNumberedVersion.LATEST)
        ).rejects.toThrow(errorExpected)
      })
    })
  })
})
