import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createMultipartFileBlob,
  createSinglepartFileBlob,
  registerFileViaApi,
  uploadFileViaApi,
  testTextFile1Name,
  testTextFile2Name,
  testTextFile3Name,
  testTabFile4Name
} from '../../testHelpers/files/filesHelper'
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
import { FileModel } from '../../../src/files/domain/models/FileModel'
import { FileCounts } from '../../../src/files/domain/models/FileCounts'
import { FileDownloadSizeMode, WriteError } from '../../../src'
import {
  deaccessionDatasetViaApi,
  publishDatasetViaApi,
  waitForNoLocks,
  deletePublishedDatasetViaApi,
  deleteUnpublishedDatasetViaApi
} from '../../testHelpers/datasets/datasetHelper'
import {
  createCollectionViaApi,
  deleteCollectionViaApi,
  setStorageDriverViaApi
} from '../../testHelpers/collections/collectionHelper'
import { RestrictFileDTO } from '../../../src/files/domain/dtos/RestrictFileDTO'
import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository'

describe('FilesRepository', () => {
  const sut: FilesRepository = new FilesRepository()
  const sutDataset: DatasetsRepository = new DatasetsRepository()

  let testDatasetIds: CreatedDatasetIdentifiers

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
          `[400] Bad dataset ID number: ${testWrongPersistentId}.`
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
        const actual: FileModel = (await sut.getFile(
          testFileId,
          DatasetNotNumberedVersion.LATEST,
          false
        )) as FileModel

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file draft when providing a valid id and version is draft', async () => {
        const actual: FileModel = (await sut.getFile(
          testFileId,
          DatasetNotNumberedVersion.DRAFT,
          false
        )) as FileModel

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file and dataset when providing id, version, and returnDatasetVersion is true', async () => {
        const actual = (await sut.getFile(testFileId, DatasetNotNumberedVersion.DRAFT, true)) as [
          FileModel,
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
        )) as FileModel

        expect(actual.name).toBe(testTextFile1Name)
      })

      test('should return file draft when providing a valid persistent id and version is draft', async () => {
        const actual = (await sut.getFile(
          testFilePersistentId,
          DatasetNotNumberedVersion.DRAFT,
          false
        )) as FileModel

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

  describe('getFileUploadDestination', () => {
    const testCollectionAlias = 'getFileUploadDestinationsTestCollection'
    let testDataset2Ids: CreatedDatasetIdentifiers

    const expectedUrlFragment = '/mybucket/'
    const expectedStorageIdFragment = 'localstack1://mybucket:'

    let singlepartFile: File
    let multipartFile: File

    beforeAll(async () => {
      await createCollectionViaApi(testCollectionAlias)
      await setStorageDriverViaApi(testCollectionAlias, 'LocalStack')
      testDataset2Ids = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
      singlepartFile = await createSinglepartFileBlob()
      multipartFile = await createMultipartFileBlob()
    })

    afterAll(async () => {
      await deleteUnpublishedDatasetViaApi(testDataset2Ids.numericId)
      await deleteCollectionViaApi(testCollectionAlias)
    })

    test('should return upload destination when dataset exists and the file does not require multipart download', async () => {
      const actualFileDestination = await sut.getFileUploadDestination(
        testDataset2Ids.numericId,
        singlepartFile
      )
      expect(actualFileDestination.urls.length).toBe(1)
      expect(actualFileDestination.urls[0]).toContain(expectedUrlFragment)
      expect(actualFileDestination.partSize).not.toBeUndefined()
      expect(actualFileDestination.storageId).toContain(expectedStorageIdFragment)
    })

    test('should return upload destination when dataset exists and the file requires multipart download', async () => {
      const actualFileDestination = await sut.getFileUploadDestination(
        testDataset2Ids.numericId,
        multipartFile
      )
      expect(actualFileDestination.urls.length).toBeGreaterThan(1)
      expect(actualFileDestination.urls[0]).toContain(expectedUrlFragment)
      expect(actualFileDestination.partSize).not.toBeUndefined()
      expect(actualFileDestination.storageId).toContain(expectedStorageIdFragment)
      expect(actualFileDestination.urls[0]).not.toEqual(actualFileDestination.urls[1])
    })

    test('should return error when dataset does not exist', async () => {
      const nonExistentDatasetId = 400000
      const errorExpected = new ReadError(
        `[404] Dataset with ID ${nonExistentDatasetId} not found.`
      )

      await expect(
        sut.getFileUploadDestination(nonExistentDatasetId, singlepartFile)
      ).rejects.toThrow(errorExpected)
    })

    test('should return error when direct upload is not configured in the dataset', async () => {
      const errorExpected = new ReadError(
        `[404] Direct upload not supported for files in this dataset: ${testDatasetIds.numericId}`
      )

      await expect(
        sut.getFileUploadDestination(testDatasetIds.numericId, singlepartFile)
      ).rejects.toThrow(errorExpected)
    })
  })

  describe('updateFileMetadata', () => {
    test('should update file metadata when file exists', async () => {
      const testFileMetadata = {
        description: 'My description test.',
        categories: ['Data'],
        restrict: false
      }

      const actual = await sut.updateFileMetadata(testFileId, testFileMetadata)

      expect(actual).toBeUndefined()

      const fileInfo: FileModel = (await sut.getFile(
        testFileId,
        DatasetNotNumberedVersion.LATEST,
        false
      )) as FileModel

      expect(fileInfo.description).toBe(testFileMetadata.description)
      expect(fileInfo.categories).toEqual(testFileMetadata.categories)
      expect(fileInfo.restricted).toBe(testFileMetadata.restrict)
    })

    test('should return error when file does not exist', async () => {
      const testFileMetadata = {
        description: 'My description test.',
        categories: ['Data'],
        restrict: false
      }
      const errorExpected = new WriteError(`[400] Error attempting get the requested data file.`)

      await expect(sut.updateFileMetadata(nonExistentFiledId, testFileMetadata)).rejects.toThrow(
        errorExpected
      )
    })
  })

  describe('deleteFile', () => {
    let deleFileTestDatasetIds: CreatedDatasetIdentifiers
    const testTextFile1Name = 'test-file-1.txt'

    beforeEach(async () => {
      try {
        deleFileTestDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      } catch (error) {
        throw new Error('Tests beforeEach(): Error while creating test dataset')
      }
      await uploadFileViaApi(deleFileTestDatasetIds.numericId, testTextFile1Name).catch(() => {
        throw new Error(`Tests beforeEach(): Error while uploading file ${testTextFile1Name}`)
      })
    })

    test('should successfully delete a file', async () => {
      const datasetFiles = await sut.getDatasetFiles(
        deleFileTestDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ
      )
      await sut.deleteFile(datasetFiles.files[0].id)

      const datasetFileCounts = await sut.getDatasetFileCounts(
        deleFileTestDatasetIds.numericId,
        latestDatasetVersionId,
        false
      )
      expect(datasetFileCounts.total).toEqual(0)

      await deleteUnpublishedDatasetViaApi(deleFileTestDatasetIds.numericId)
    })

    test('should delete a file from the draft dataset but not from the published dataset', async () => {
      await publishDatasetViaApi(deleFileTestDatasetIds.numericId).catch(() => {
        throw new Error('Error while publishing test Dataset')
      })

      await waitForNoLocks(deleFileTestDatasetIds.numericId, 10).catch(() => {
        throw new Error('Error while waiting for no locks')
      })

      const datasetFiles = await sut.getDatasetFiles(
        deleFileTestDatasetIds.numericId,
        latestDatasetVersionId,
        false,
        FileOrderCriteria.NAME_AZ
      )
      await sut.deleteFile(datasetFiles.files[0].id)

      const datasetFileCounts = await sut.getDatasetFileCounts(
        deleFileTestDatasetIds.numericId,
        DatasetNotNumberedVersion.DRAFT,
        false
      )

      expect(datasetFileCounts.total).toEqual(0)

      const publishedDatasetFileCounts = await sut.getDatasetFileCounts(
        deleFileTestDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST_PUBLISHED,
        false
      )

      expect(publishedDatasetFileCounts.total).toBeGreaterThan(0)

      await deletePublishedDatasetViaApi(deleFileTestDatasetIds.persistentId).catch(() => {
        throw new Error('Error while deleting published test Dataset')
      })
    })

    test('should return error when file does not exist', async () => {
      const expectedError = new WriteError(`[404] File with ID ${nonExistentFiledId} not found.`)

      await expect(sut.deleteFile(nonExistentFiledId)).rejects.toThrow(expectedError)
    })
  })

  describe('restrictFile', () => {
    let restrictFileDatasetIds: CreatedDatasetIdentifiers
    const testTextFile1Name = 'test-file-1.txt'
    const restrictFileDTO: RestrictFileDTO = {
      restrict: true,
      enableAccessRequest: true,
      termsOfAccess: 'This file is restricted for testing purposes'
    }

    const unrestrictFileDTO: RestrictFileDTO = { restrict: false }

    const setFileToRestricted = async (fileId: number) => {
      await sut.restrictFile(fileId, restrictFileDTO)
    }

    const setFileToUnrestricted = async (fileId: number) => {
      await sut.restrictFile(fileId, unrestrictFileDTO)
    }

    beforeEach(async () => {
      try {
        restrictFileDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      } catch (error) {
        throw new Error('Tests beforeEach(): Error while creating test dataset')
      }
      await uploadFileViaApi(restrictFileDatasetIds.numericId, testTextFile1Name).catch(() => {
        throw new Error(`Tests beforeEach(): Error while uploading file ${testTextFile1Name}`)
      })
    })

    test('should successfully restrict a file enabling access request', async () => {
      await publishDatasetViaApi(restrictFileDatasetIds.numericId).catch(() => {
        throw new Error('Error while publishing test Dataset')
      })

      await waitForNoLocks(restrictFileDatasetIds.numericId, 10).catch(() => {
        throw new Error('Error while waiting for no locks')
      })

      const datasetFiles = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      expect(datasetFiles.files[0].restricted).toEqual(false)

      await setFileToRestricted(datasetFiles.files[0].id)

      const datasetFilesAfterRestrict = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      expect(datasetFilesAfterRestrict.files[0].restricted).toEqual(restrictFileDTO.restrict)

      const dataset = await sutDataset.getDataset(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )
      expect(datasetFilesAfterRestrict.files[0].fileAccessRequest).toEqual(
        restrictFileDTO.enableAccessRequest
      )
      expect(dataset.termsOfUse.termsOfAccess.termsOfAccessForRestrictedFiles).toEqual(
        restrictFileDTO.termsOfAccess
      )

      await deletePublishedDatasetViaApi(restrictFileDatasetIds.persistentId)
    })

    test('should successfully unrestrict a file', async () => {
      const datasetFiles = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      expect(datasetFiles.files[0].restricted).toEqual(false)

      await setFileToRestricted(datasetFiles.files[0].id)

      const datasetFilesAfterRestrict = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      expect(datasetFilesAfterRestrict.files[0].restricted).toEqual(true)

      await setFileToUnrestricted(datasetFiles.files[0].id)

      const datasetFilesAfterUnrestrict = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      expect(datasetFilesAfterUnrestrict.files[0].restricted).toEqual(false)

      await deleteUnpublishedDatasetViaApi(restrictFileDatasetIds.numericId)
    })

    test('should return error when file was already restricted', async () => {
      const datasetFiles = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      await setFileToRestricted(datasetFiles.files[0].id)

      const expectedError = new WriteError(
        `[400] Problem trying to update restriction status on ${testTextFile1Name}: File ${testTextFile1Name} is already restricted`
      )

      await expect(setFileToRestricted(datasetFiles.files[0].id)).rejects.toThrow(expectedError)

      // Unrestrict the file Just in case to avoid conflicts with other tests
      await setFileToUnrestricted(datasetFiles.files[0].id)

      await deleteUnpublishedDatasetViaApi(restrictFileDatasetIds.numericId)
    })

    test('should return error when files was already unrestricted', async () => {
      const datasetFiles = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      const expectedError = new WriteError(
        `[400] Problem trying to update restriction status on ${testTextFile1Name}: File ${testTextFile1Name} is already unrestricted`
      )

      await expect(setFileToUnrestricted(datasetFiles.files[0].id)).rejects.toThrow(expectedError)

      await deleteUnpublishedDatasetViaApi(restrictFileDatasetIds.numericId)
    })

    test('should return error when file does not exist', async () => {
      const expectedError = new WriteError(
        `[400] Could not find datafile with id ${nonExistentFiledId}`
      )

      await expect(setFileToRestricted(nonExistentFiledId)).rejects.toThrow(expectedError)

      await deleteUnpublishedDatasetViaApi(restrictFileDatasetIds.numericId)
    })

    test('should return error when the terms of use is empty while enableAccess is false', async () => {
      const datasetFiles = await sut.getDatasetFiles(
        restrictFileDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )

      const errorExpected = new WriteError(
        `[409] Terms of Use and Access are invalid. You must enable request access or add terms of access in datasets with restricted files.`
      )

      await expect(
        sut.restrictFile(datasetFiles.files[0].id, {
          restrict: true,
          enableAccessRequest: false
        })
      ).rejects.toThrow(errorExpected)

      await deleteUnpublishedDatasetViaApi(restrictFileDatasetIds.numericId)
    })
  })
})
