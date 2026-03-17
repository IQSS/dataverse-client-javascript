import { AccessRepository } from '../../../src/access/infra/repositories/AccessRepository'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'
import { GuestbookResponseDTO } from '../../../src/access/domain/dtos/GuestbookResponseDTO'
import {
  CreatedDatasetIdentifiers,
  createDataset,
  DatasetNotNumberedVersion,
  WriteError
} from '../../../src'
import { uploadFileViaApi, testTextFile1Name } from '../../testHelpers/files/filesHelper'
import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import { FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria'
import { deletePublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'

describe('AccessRepository', () => {
  const sut: AccessRepository = new AccessRepository()
  const filesRepository: FilesRepository = new FilesRepository()
  let testDatasetIds: CreatedDatasetIdentifiers
  let testFileId: number

  const guestbookResponse: GuestbookResponseDTO = {
    guestbookResponse: {
      name: 'Terminal Test',
      email: 'terminal@example.edu',
      institution: 'Dataverse Client JavaScript',
      position: 'CLI',
      answers: []
    }
  }

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )

    try {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name)
      const filesSubset = await filesRepository.getDatasetFiles(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        FileOrderCriteria.NAME_AZ
      )
      testFileId = filesSubset.files[0].id
    } catch (error) {
      throw new Error('Tests beforeAll(): Error while setting up access integration test data.')
    }
  })

  afterAll(async () => {
    try {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    } catch (error) {
      throw new Error('Tests afterAll(): Error while cleaning up access integration test data.')
    }
  })

  describe('submitGuestbookForDatafileDownload', () => {
    test('should return signed url for datafile download', async () => {
      const actual = await sut.submitGuestbookForDatafileDownload(testFileId, guestbookResponse)

      expect(actual).toEqual(expect.any(String))
      expect(() => new URL(actual)).not.toThrow()
    })

    test('should return error when datafile does not exist', async () => {
      const nonExistentId = 999999999
      await expect(
        sut.submitGuestbookForDatafileDownload(nonExistentId, guestbookResponse)
      ).rejects.toThrow(WriteError)
    })
  })

  describe('submitGuestbookForDatafilesDownload', () => {
    test('should return signed url for datafiles download', async () => {
      const actual = await sut.submitGuestbookForDatafilesDownload([testFileId], guestbookResponse)

      expect(actual).toEqual(expect.any(String))
      expect(actual.length).toBeGreaterThan(0)
    })
  })

  describe('submitGuestbookForDatasetDownload', () => {
    test('should return signed url for dataset download', async () => {
      const actual = await sut.submitGuestbookForDatasetDownload(
        testDatasetIds.numericId,
        guestbookResponse
      )
      expect(actual).toEqual(expect.any(String))
      expect(() => new URL(actual)).not.toThrow()
    })

    test('should return error when dataset does not exist', async () => {
      const nonExistentId = 999999999
      await expect(
        sut.submitGuestbookForDatasetDownload(nonExistentId, guestbookResponse)
      ).rejects.toThrow(WriteError)
    })
  })

  describe('submitGuestbookForDatasetVersionDownload', () => {
    test('should return signed url for dataset version download', async () => {
      const actual = await sut.submitGuestbookForDatasetVersionDownload(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        guestbookResponse
      )
      expect(actual).toEqual(expect.any(String))
      expect(() => new URL(actual)).not.toThrow()
    })

    test('should return error when dataset version does not exist', async () => {
      const nonExistentId = 999999999
      await expect(
        sut.submitGuestbookForDatasetVersionDownload(
          nonExistentId,
          DatasetNotNumberedVersion.LATEST,
          guestbookResponse
        )
      ).rejects.toThrow(WriteError)
    })
  })
})
