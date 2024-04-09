import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createPrivateUrlViaApi,
  publishDatasetViaApi,
  waitForNoLocks,
  deleteUnpublishedDatasetViaApi,
  waitForDatasetsIndexedInSolr,
  deletePublishedDatasetViaApi,
  deaccessionDatasetViaApi
} from '../../testHelpers/datasets/datasetHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  DatasetLockType,
  DatasetNotNumberedVersion,
  DatasetPreviewSubset,
  VersionUpdateType,
  createDataset,
  CreatedDatasetIdentifiers
} from '../../../src/datasets'
import { ApiConfig, WriteError } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { MetadataBlocksRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataBlocksRepository'
import {
  Author,
  DatasetContact,
  DatasetDescription
} from '../../../src/datasets/domain/models/Dataset'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'
import { createCollectionViaApi } from '../../testHelpers/collections/collectionHelper'

describe('DatasetsRepository', () => {
  const sut: DatasetsRepository = new DatasetsRepository()
  const nonExistentTestDatasetId = 100

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  afterAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  describe('getAllDatasetPreviews', () => {
    const testPageLimit = 1
    const expectedTotalDatasetCount = 4
    let firstDatasetIds: CreatedDatasetIdentifiers
    let secondDatasetIds: CreatedDatasetIdentifiers
    let thirdDatasetIds: CreatedDatasetIdentifiers
    let fourthDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      await createDatasets()
    })

    afterAll(async () => {
      await deleteDatasets()
    })

    const createDatasets = async () => {
      try {
        firstDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
        secondDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
        thirdDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

        await createCollectionViaApi()

        fourthDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          TestConstants.TEST_CREATED_COLLECTION_ALIAS
        )

        await waitForDatasetsIndexedInSolr(expectedTotalDatasetCount)
      } catch (error) {
        throw Error('Error while creating test datasets')
      }
    }

    const deleteDatasets = async () => {
      try {
        await deleteUnpublishedDatasetViaApi(firstDatasetIds.numericId)
        await deleteUnpublishedDatasetViaApi(secondDatasetIds.numericId)
        await deleteUnpublishedDatasetViaApi(thirdDatasetIds.numericId)
        await deleteUnpublishedDatasetViaApi(fourthDatasetIds.numericId)
      } catch (error) {
        throw Error('Error while deleting test datasets')
      }
    }

    test('should return all dataset previews when no pagination params are defined', async () => {
      const actual: DatasetPreviewSubset = await sut.getAllDatasetPreviews()
      expect(actual.datasetPreviews.length).toEqual(expectedTotalDatasetCount)
      expect(actual.datasetPreviews[0].persistentId).toMatch(fourthDatasetIds.persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return first dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 0)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(fourthDatasetIds.persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return second dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 1)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(thirdDatasetIds.persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return third dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 2)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(secondDatasetIds.persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return fourth dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 3)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(firstDatasetIds.persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return datasets in the specified collection', async () => {
      const actual = await sut.getAllDatasetPreviews(
        testPageLimit,
        0,
        TestConstants.TEST_CREATED_COLLECTION_ALIAS
      )
      expect(actual.datasetPreviews[0].persistentId).toMatch(fourthDatasetIds.persistentId)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.totalDatasetCount).toEqual(1)
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
      let testDatasetIds: CreatedDatasetIdentifiers

      beforeAll(async () => {
        try {
          testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
        } catch (error) {
          throw Error('Error while creating test dataset')
        }
      })

      afterAll(async () => {
        try {
          await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
        } catch (error) {
          throw Error('Error while deleting test dataset')
        }
      })

      test('should return dataset when it exists filtering by id and version id', async () => {
        const actual = await sut.getDataset(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          false
        )
        expect(actual.id).toBe(testDatasetIds.numericId)
      })

      test('should return dataset when it is deaccessioned and includeDeaccessioned param is set', async () => {
        await publishDatasetViaApi(testDatasetIds.numericId)
        await waitForNoLocks(testDatasetIds.numericId, 10)
        await deaccessionDatasetViaApi(testDatasetIds.numericId, '1.0')

        const actual = await sut.getDataset(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          true
        )

        expect(actual.id).toBe(testDatasetIds.numericId)
      })

      test('should return dataset when it is deaccessioned, includeDeaccessioned param is set, and user is unauthenticated', async () => {
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, undefined)
        const actual = await sut.getDataset(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          true
        )
        expect(actual.id).toBe(testDatasetIds.numericId)
        ApiConfig.init(
          TestConstants.TEST_API_URL,
          DataverseApiAuthMechanism.API_KEY,
          process.env.TEST_API_KEY
        )
      })

      test('should return error when dataset is deaccessioned and includeDeaccessioned param is not set', async () => {
        const expectedError = new ReadError(
          `[404] Dataset version ${DatasetNotNumberedVersion.LATEST} of dataset ${testDatasetIds.numericId} not found`
        )
        await expect(
          sut.getDataset(testDatasetIds.numericId, DatasetNotNumberedVersion.LATEST, false)
        ).rejects.toThrow(expectedError)
      })

      test('should return error when dataset does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
        )

        await expect(
          sut.getDataset(nonExistentTestDatasetId, DatasetNotNumberedVersion.LATEST, false)
        ).rejects.toThrow(expectedError)
      })
    })

    describe('by persistent id', () => {
      let testDatasetIds: CreatedDatasetIdentifiers

      beforeAll(async () => {
        try {
          testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
        } catch (error) {
          throw Error('Error while creating test dataset')
        }
      })

      afterAll(async () => {
        try {
          await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
        } catch (error) {
          throw Error('Error while deleting test dataset')
        }
      })

      test('should return dataset when it exists filtering by persistent id and version id', async () => {
        const createdDataset = await sut.getDataset(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          false
        )
        const actual = await sut.getDataset(
          createdDataset.persistentId,
          DatasetNotNumberedVersion.LATEST,
          false
        )
        expect(actual.id).toBe(testDatasetIds.numericId)
      })

      test('should return error when dataset does not exist', async () => {
        const testWrongPersistentId = 'wrongPersistentId'
        const expectedError = new ReadError(
          `[404] Dataset with Persistent ID ${testWrongPersistentId} not found.`
        )
        await expect(
          sut.getDataset(testWrongPersistentId, DatasetNotNumberedVersion.LATEST, false)
        ).rejects.toThrow(expectedError)
      })
    })
  })

  describe.skip('Private URLs', () => {
    const expectedErrorInvalidToken = '[404] Private URL user not found'
    let privateUrlToken: string

    beforeAll(async () => {
      try {
        const response = await createPrivateUrlViaApi(TestConstants.TEST_CREATED_DATASET_1_ID)
        privateUrlToken = response.data.data.token
      } catch (error) {
        throw new Error('Tests beforeAll(): Error while creating Dataset private URL')
      }
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
  })

  describe.skip('getDatasetLocks', () => {
    test('should return list of dataset locks by dataset id for a dataset while publishing', async () => {
      await publishDatasetViaApi(TestConstants.TEST_CREATED_DATASET_2_ID)
        .then()
        .catch((error) => {
          console.log(JSON.stringify(error))
        })
      const actual = await sut.getDatasetLocks(TestConstants.TEST_CREATED_DATASET_2_ID)
      expect(actual.length).toBe(1)
      expect(actual[0].lockType).toBe(DatasetLockType.FINALIZE_PUBLICATION)
      expect(actual[0].userId).toBe('dataverseAdmin')
      expect(actual[0].message).toBe(
        'Publishing the dataset; Registering PIDs for Datafiles; Validating Datafiles Asynchronously'
      )
    })

    test('should return error when dataset does not exist', async () => {
      const expectedError = new ReadError(
        `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
      )

      await expect(sut.getDatasetLocks(nonExistentTestDatasetId)).rejects.toThrow(expectedError)
    })
  })

  describe.skip('getDatasetCitation', () => {
    test('should return citation when dataset exists', async () => {
      const actualDatasetCitation = await sut.getDatasetCitation(
        TestConstants.TEST_CREATED_DATASET_1_ID,
        DatasetNotNumberedVersion.LATEST,
        false
      )
      expect(typeof actualDatasetCitation).toBe('string')
    })

    test('should return error when dataset does not exist', async () => {
      const expectedError = new ReadError(
        `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
      )

      await expect(
        sut.getDatasetCitation(nonExistentTestDatasetId, DatasetNotNumberedVersion.LATEST, false)
      ).rejects.toThrow(expectedError)
    })

    test('should return citation when dataset is deaccessioned', async () => {
      const actualDatasetCitation = await sut.getDatasetCitation(
        TestConstants.TEST_CREATED_DATASET_2_ID,
        DatasetNotNumberedVersion.LATEST,
        true
      )
      expect(typeof actualDatasetCitation).toBe('string')
    })
  })

  describe.skip('createDataset', () => {
    test('should create a dataset with the provided dataset citation fields', async () => {
      const testNewDataset = {
        metadataBlockValues: [
          {
            name: 'citation',
            fields: {
              title: 'Dataset created using the createDataset use case',
              author: [
                {
                  authorName: 'Admin, Dataverse',
                  authorAffiliation: 'Dataverse.org'
                },
                {
                  authorName: 'Owner, Dataverse',
                  authorAffiliation: 'Dataversedemo.org'
                }
              ],
              datasetContact: [
                {
                  datasetContactEmail: 'finch@mailinator.com',
                  datasetContactName: 'Finch, Fiona'
                }
              ],
              dsDescription: [
                {
                  dsDescriptionValue: 'This is the description of the dataset.'
                }
              ],
              subject: ['Medicine, Health and Life Sciences']
            }
          }
        ]
      }

      const metadataBlocksRepository = new MetadataBlocksRepository()
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName(
        'citation'
      )
      const createdDataset = await sut.createDataset(
        testNewDataset,
        [citationMetadataBlock],
        ROOT_COLLECTION_ALIAS
      )
      const actualCreatedDataset = await sut.getDataset(
        createdDataset.numericId,
        DatasetNotNumberedVersion.LATEST,
        false
      )

      expect(actualCreatedDataset.metadataBlocks[0].fields.title).toBe(
        'Dataset created using the createDataset use case'
      )
      expect((actualCreatedDataset.metadataBlocks[0].fields.author[0] as Author).authorName).toBe(
        'Admin, Dataverse'
      )
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.author[0] as Author).authorAffiliation
      ).toBe('Dataverse.org')
      expect((actualCreatedDataset.metadataBlocks[0].fields.author[1] as Author).authorName).toBe(
        'Owner, Dataverse'
      )
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.author[1] as Author).authorAffiliation
      ).toBe('Dataversedemo.org')
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.datasetContact[0] as DatasetContact)
          .datasetContactEmail
      ).toBe('finch@mailinator.com')
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.datasetContact[0] as DatasetContact)
          .datasetContactName
      ).toBe('Finch, Fiona')
      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.dsDescription[0] as DatasetDescription)
          .dsDescriptionValue
      ).toBe('This is the description of the dataset.')
      expect(actualCreatedDataset.metadataBlocks[0].fields.subject).toContain(
        'Medicine, Health and Life Sciences'
      )
    })
  })

  describe.skip('publishDataset', () => {
    test('should publish a new dataset version', async () => {
      const expectedMajorVersion = 1
      await waitForNoLocks(TestConstants.TEST_CREATED_DATASET_4_ID, 10)

      await sut.publishDataset(TestConstants.TEST_CREATED_DATASET_4_ID, VersionUpdateType.MAJOR)
      await waitForNoLocks(TestConstants.TEST_CREATED_DATASET_4_ID, 10)

      const newDatasetVersion = await sut.getDataset(
        TestConstants.TEST_CREATED_DATASET_4_ID,
        DatasetNotNumberedVersion.LATEST,
        false
      )

      expect(newDatasetVersion.versionInfo.majorNumber).toBe(expectedMajorVersion)
    })

    test('should return error when dataset does not exist', async () => {
      const expectedError = new WriteError(
        `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
      )

      await expect(
        sut.publishDataset(nonExistentTestDatasetId, VersionUpdateType.MAJOR)
      ).rejects.toThrow(expectedError)
    })
  })
})
