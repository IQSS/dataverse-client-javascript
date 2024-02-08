import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createPrivateUrlViaApi,
  publishDatasetViaApi,
  deaccessionDatasetViaApi,
  waitForNoLocks
} from '../../testHelpers/datasets/datasetHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  DatasetNotNumberedVersion,
  DatasetLockType,
  DatasetPreviewSubset
} from '../../../src/datasets'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('DatasetsRepository', () => {
  const sut: DatasetsRepository = new DatasetsRepository()
  const nonExistentTestDatasetId = 100

  const latestVersionId = DatasetNotNumberedVersion.LATEST

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  describe('getAllDatasetPreviews', () => {
    const testPageLimit = 1

    test('should return all dataset previews when no pagination params are defined', async () => {
      const actual: DatasetPreviewSubset = await sut.getAllDatasetPreviews()
      expect(actual.datasetPreviews.length).toBe(2)
      expect(actual.datasetPreviews[0].title).toBe('Second Dataset')
      expect(actual.totalDatasetCount).toBe(2)
    })

    test('should return first dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 0)
      expect(actual.datasetPreviews.length).toBe(1)
      expect(actual.datasetPreviews[0].title).toBe('Second Dataset')
      expect(actual.totalDatasetCount).toBe(2)
    })

    test('should return second dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 1)
      expect(actual.datasetPreviews.length).toBe(1)
      expect(actual.datasetPreviews[0].title).toBe('First Dataset')
      expect(actual.totalDatasetCount).toBe(2)
    })

    test('should return third dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 2)
      expect(actual.datasetPreviews.length).toBe(0)
      expect(actual.totalDatasetCount).toBe(2)
    })
  })

  describe('getDatasetSummaryFieldNames', () => {
    test('should return not empty field list on successful response', async () => {
      const actual = await sut.getDatasetSummaryFieldNames()

      expect(actual.length).toBeGreaterThan(0)
    })
  })

  describe('getDataset', () => {
    describe('by numeric id', () => {
      test('should return dataset when it exists filtering by id and version id', async () => {
        const actual = await sut.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestVersionId,
          false
        )
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_1_ID)
      })

      test('should return error when dataset does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
        )

        await expect(
          sut.getDataset(nonExistentTestDatasetId, latestVersionId, false)
        ).rejects.toThrow(expectedError)
      })
    })
    describe('by persistent id', () => {
      test('should return dataset when it exists filtering by persistent id and version id', async () => {
        const createdDataset = await sut.getDataset(
          TestConstants.TEST_CREATED_DATASET_1_ID,
          latestVersionId,
          false
        )
        const actual = await sut.getDataset(createdDataset.persistentId, latestVersionId, false)
        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_1_ID)
      })

      test('should return error when dataset does not exist', async () => {
        const testWrongPersistentId = 'wrongPersistentId'
        const expectedError = new ReadError(
          `[404] Dataset with Persistent ID ${testWrongPersistentId} not found.`
        )

        await expect(sut.getDataset(testWrongPersistentId, latestVersionId, false)).rejects.toThrow(
          expectedError
        )
      })
    })
  })

  describe('Private URLs', () => {
    const expectedErrorInvalidToken = '[404] Private URL user not found'
    let privateUrlToken: string = undefined

    beforeAll(async () => {
      await createPrivateUrlViaApi(TestConstants.TEST_CREATED_DATASET_1_ID)
        .then((response) => {
          privateUrlToken = response.data.data.token
        })
        .catch(() => {
          throw new Error('Tests beforeAll(): Error while creating Dataset private URL')
        })
    })

    describe('getPrivateUrlDataset', () => {
      test('should return dataset when token is valid', async () => {
        const actual = await sut.getPrivateUrlDataset(privateUrlToken)

        expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_1_ID)
      })

      test('should return error when token is not valid', async () => {
        const expectedError = new ReadError(expectedErrorInvalidToken)

        await expect(sut.getPrivateUrlDataset('invalidToken')).rejects.toThrow(expectedError)
      })
    })

    describe('getPrivateUrlDatasetCitation', () => {
      test('should return dataset citation when token is valid', async () => {
        const actual = await sut.getPrivateUrlDatasetCitation(privateUrlToken)

        expect(typeof actual).toBe('string')
      })

      test('should return error when token is not valid', async () => {
        const expectedError = new ReadError(expectedErrorInvalidToken)

        await expect(sut.getPrivateUrlDatasetCitation('invalidToken')).rejects.toThrow(
          expectedError
        )
      })
    })

    describe('getDatasetUserPermissions', () => {
      test('should return user permissions filtering by dataset id', async () => {
        const actual = await sut.getDatasetUserPermissions(TestConstants.TEST_CREATED_DATASET_1_ID)
        expect(actual.canViewUnpublishedDataset).toBe(true)
        expect(actual.canEditDataset).toBe(true)
        expect(actual.canPublishDataset).toBe(true)
        expect(actual.canManageDatasetPermissions).toBe(true)
        expect(actual.canDeleteDatasetDraft).toBe(true)
      })

      test('should return error when dataset does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
        )

        await expect(sut.getDatasetUserPermissions(nonExistentTestDatasetId)).rejects.toThrow(
          expectedError
        )
      })
    })

    describe('getDatasetLocks', () => {
      test('should return list of dataset locks by dataset id for a dataset while publishing', async () => {
        await publishDatasetViaApi(TestConstants.TEST_CREATED_DATASET_2_ID)
          .then()
          .catch(() => {
            throw new Error('Error while publishing test Dataset')
          })
        const actual = await sut.getDatasetLocks(TestConstants.TEST_CREATED_DATASET_2_ID)
        expect(actual.length).toBe(1)
        expect(actual[0].lockType).toBe(DatasetLockType.FINALIZE_PUBLICATION)
        expect(actual[0].userId).toBe('dataverseAdmin')
        expect(actual[0].message).toBe(
          'Publishing the dataset; Validating Datafiles Asynchronously'
        )
      })

      test('should return error when dataset does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
        )

        await expect(sut.getDatasetLocks(nonExistentTestDatasetId)).rejects.toThrow(expectedError)
      })
    })
  })

  describe('getDatasetCitation', () => {
    test('should return citation when dataset exists', async () => {
      const actualDatasetCitation = await sut.getDatasetCitation(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        latestVersionId,
        false
      )
      expect(typeof actualDatasetCitation).toBe('string')
    })

    test('should return error when dataset does not exist', async () => {
      const expectedError = new ReadError(
        `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
      )

      await expect(
        sut.getDatasetCitation(nonExistentTestDatasetId, latestVersionId, false)
      ).rejects.toThrow(expectedError)
    })

    test('should return citation when dataset is deaccessioned', async () => {
      await waitForNoLocks(TestConstants.TEST_CREATED_DATASET_2_ID, 10)
        .then()
        .catch(() => {
          throw new Error('Error while waiting for no locks')
        })

      await deaccessionDatasetViaApi(TestConstants.TEST_CREATED_DATASET_2_ID, '1.0')
        .then()
        .catch(() => {
          throw new Error('Error while deaccessioning test Dataset')
        })

      const actualDatasetCitation = await sut.getDatasetCitation(
        TestConstants.TEST_CREATED_DATASET_2_ID,
        latestVersionId,
        true
      )
      expect(typeof actualDatasetCitation).toBe('string')
    })
  })
})
