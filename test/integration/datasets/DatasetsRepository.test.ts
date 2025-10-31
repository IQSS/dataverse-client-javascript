import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  createPrivateUrlViaApi,
  publishDatasetViaApi,
  waitForNoLocks,
  deleteUnpublishedDatasetViaApi,
  waitForDatasetsIndexedInSolr,
  deletePublishedDatasetViaApi,
  deaccessionDatasetViaApi,
  createDatasetLicenseModel
} from '../../testHelpers/datasets/datasetHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import {
  DatasetLockType,
  DatasetNotNumberedVersion,
  DatasetPreviewSubset,
  VersionUpdateType,
  createDataset,
  CreatedDatasetIdentifiers,
  DatasetDTO,
  DatasetDeaccessionDTO,
  publishDataset,
  DatasetType,
  getDatasetAvailableDatasetTypes,
  getDatasetAvailableDatasetType,
  addDatasetType,
  deleteDatasetType,
  linkDatasetTypeWithMetadataBlocks,
  setAvailableLicensesForDatasetType,
  updateTermsOfAccess
} from '../../../src/datasets'
import { ApiConfig, WriteError } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { MetadataBlocksRepository } from '../../../src/metadataBlocks/infra/repositories/MetadataBlocksRepository'
import {
  Author,
  DatasetContact,
  DatasetDescription,
  Publication,
  TermsOfAccess
} from '../../../src/datasets/domain/models/Dataset'
import {
  createCollectionViaApi,
  deleteCollectionViaApi,
  publishCollectionViaApi,
  ROOT_COLLECTION_ALIAS,
  setStorageDriverViaApi
} from '../../testHelpers/collections/collectionHelper'
import {
  calculateBlobChecksum,
  createSinglepartFileBlob,
  testTextFile1Name,
  uploadFileViaApi
} from '../../testHelpers/files/filesHelper'
import {
  DatasetVersionSummary,
  DatasetVersionSummaryStringValues
} from '../../../src/datasets/domain/models/DatasetVersionSummaryInfo'
import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository'
import { DirectUploadClient } from '../../../src/files/infra/clients/DirectUploadClient'
import { createTestFileUploadDestination } from '../../testHelpers/files/fileUploadDestinationHelper'
import { CitationFormat } from '../../../src/datasets/domain/models/CitationFormat'
import {
  createDatasetTemplateViaApi,
  deleteDatasetTemplateViaApi
} from '../../testHelpers/datasets/datasetTemplatesHelper'

const TEST_DIFF_DATASET_DTO: DatasetDTO = {
  license: {
    name: 'CC0 1.0',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  },
  metadataBlockValues: [
    {
      name: 'citation',
      fields: {
        title: 'Updated Dataset Title',
        author: [
          {
            authorName: 'Smith, John',
            authorAffiliation: 'Dataverse.org'
          },
          {
            authorName: 'Owner, Dataverse',
            authorAffiliation: 'Dataversedemo.org'
          }
        ],
        datasetContact: [
          {
            datasetContactEmail: 'bird@mailinator.com',
            datasetContactName: 'Bird, Fiona'
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: 'This is the updated description of the dataset.'
          }
        ],
        subject: ['Medicine, Health and Life Sciences']
      }
    }
  ]
}

describe('DatasetsRepository', () => {
  const testCollectionAlias = 'datasetsRepositoryTestCollection'

  const sut: DatasetsRepository = new DatasetsRepository()
  const nonExistentTestDatasetId = 1000

  const filesRepositorySut = new FilesRepository()
  const directUploadSut: DirectUploadClient = new DirectUploadClient(filesRepositorySut)
  const defaultDatasetType = 'dataset'

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
    const createdDatasetIds: CreatedDatasetIdentifiers[] = []

    beforeAll(async () => {
      await createCollection()
      await createDatasets()
    })

    afterAll(async () => {
      await deleteDatasets()
      await deleteCollection()
    })

    const createCollection = async () => {
      await createCollectionViaApi(testCollectionAlias)
    }

    const createDatasets = async () => {
      for (let i = 0; i < expectedTotalDatasetCount; i++) {
        createdDatasetIds[i] = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testCollectionAlias
        )
      }

      await waitForDatasetsIndexedInSolr(expectedTotalDatasetCount, testCollectionAlias)
    }

    const deleteDatasets = async () => {
      for (let i = 0; i < expectedTotalDatasetCount; i++) {
        await deleteUnpublishedDatasetViaApi(createdDatasetIds[i].numericId)
      }
    }

    const deleteCollection = async () => {
      await deleteCollectionViaApi(testCollectionAlias)
    }

    test('should return all dataset previews when no pagination params are defined', async () => {
      const actual: DatasetPreviewSubset = await sut.getAllDatasetPreviews(
        undefined,
        undefined,
        testCollectionAlias
      )
      expect(actual.datasetPreviews.length).toEqual(expectedTotalDatasetCount)
      expect(actual.datasetPreviews[0].persistentId).toMatch(createdDatasetIds[3].persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return first dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 0, testCollectionAlias)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(createdDatasetIds[3].persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return second dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 1, testCollectionAlias)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(createdDatasetIds[2].persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return third dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 2, testCollectionAlias)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(createdDatasetIds[1].persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
    })

    test('should return fourth dataset preview page', async () => {
      const actual = await sut.getAllDatasetPreviews(testPageLimit, 3, testCollectionAlias)
      expect(actual.datasetPreviews.length).toEqual(1)
      expect(actual.datasetPreviews[0].persistentId).toMatch(createdDatasetIds[0].persistentId)
      expect(actual.totalDatasetCount).toEqual(expectedTotalDatasetCount)
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
        testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      })

      afterAll(async () => {
        await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      })

      test('should return dataset when it exists filtering by id and version id', async () => {
        const actual = await sut.getDataset(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          false,
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
          true,
          false
        )

        expect(actual.id).toBe(testDatasetIds.numericId)
      })

      test('should return dataset when it is deaccessioned, includeDeaccessioned param is set, and user is unauthenticated', async () => {
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, undefined)
        const actual = await sut.getDataset(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          true,
          false
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
          sut.getDataset(testDatasetIds.numericId, DatasetNotNumberedVersion.LATEST, false, false)
        ).rejects.toThrow(expectedError)
      })

      test('should return error when dataset does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
        )

        await expect(
          sut.getDataset(nonExistentTestDatasetId, DatasetNotNumberedVersion.LATEST, false, false)
        ).rejects.toThrow(expectedError)
      })
    })

    describe('by persistent id', () => {
      let testDatasetIds: CreatedDatasetIdentifiers

      beforeAll(async () => {
        testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      })

      afterAll(async () => {
        await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
      })

      test('should return dataset when it exists filtering by persistent id and version id', async () => {
        const createdDataset = await sut.getDataset(
          testDatasetIds.numericId,
          DatasetNotNumberedVersion.LATEST,
          false,
          false
        )
        const actual = await sut.getDataset(
          createdDataset.persistentId,
          DatasetNotNumberedVersion.LATEST,
          false,
          false
        )
        expect(actual.id).toBe(testDatasetIds.numericId)
      })

      test('should return error when dataset does not exist', async () => {
        const testWrongPersistentId = 'wrongPersistentId'
        const expectedError = new ReadError(
          `[400] Bad dataset ID number: ${testWrongPersistentId}.`
        )
        await expect(
          sut.getDataset(testWrongPersistentId, DatasetNotNumberedVersion.LATEST, false, false)
        ).rejects.toThrow(expectedError)
      })
    })

    describe('returns correct isPartOf properties', () => {
      test('should return isPartOf property correctly when dataset is part of an unpublished collection', async () => {
        const isPartOfTestCollectionAlias = 'isPartOfTestCollection'

        const { alias: createdCollectionAlias } = await createCollectionViaApi(
          isPartOfTestCollectionAlias
        )

        const { numericId: createdDatasetNumericId } = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          createdCollectionAlias
        )

        const actual = await sut.getDataset(
          createdDatasetNumericId,
          DatasetNotNumberedVersion.LATEST,
          false,
          false
        )

        expect(actual.id).toBe(createdDatasetNumericId)
        expect(actual.isPartOf.type).toBe('DATAVERSE')
        expect(actual.isPartOf.identifier).toBe(isPartOfTestCollectionAlias)
        expect(actual.isPartOf.isReleased).toBe(false)

        await deleteUnpublishedDatasetViaApi(createdDatasetNumericId)
        await deleteCollectionViaApi(isPartOfTestCollectionAlias)
      })
    })
  })

  describe('Private URLs', () => {
    const expectedErrorInvalidToken = '[404] Private URL user not found'
    let testDatasetIds: CreatedDatasetIdentifiers
    let privateUrlToken: string

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      const response = await createPrivateUrlViaApi(testDatasetIds.numericId)
      privateUrlToken = response.data.data.token
    })

    afterAll(async () => {
      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    })

    describe('getPrivateUrlDataset', () => {
      test('should return dataset when token is valid', async () => {
        const actual = await sut.getPrivateUrlDataset(privateUrlToken, false)
        expect(actual.id).toBe(testDatasetIds.numericId)
      })

      test('should return error when token is not valid', async () => {
        const expectedError = new ReadError(expectedErrorInvalidToken)
        await expect(sut.getPrivateUrlDataset('invalidToken', false)).rejects.toThrow(expectedError)
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
  })

  describe('getDatasetUserPermissions', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    afterAll(async () => {
      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    })

    test('should return user permissions filtering by dataset id', async () => {
      const actual = await sut.getDatasetUserPermissions(testDatasetIds.numericId)
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
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should return list of dataset locks by dataset id for a dataset while publishing', async () => {
      await publishDatasetViaApi(testDatasetIds.numericId)
      const actual = await sut.getDatasetLocks(testDatasetIds.numericId)
      expect(actual.length).toBe(1)
      expect(actual[0].lockType).toBe(DatasetLockType.FINALIZE_PUBLICATION)
      expect(actual[0].userId).toBe('dataverseAdmin')
      expect(actual[0].message).toContain('Publishing the dataset')
    })

    test('should return error when dataset does not exist', async () => {
      const expectedError = new ReadError(
        `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
      )

      await expect(sut.getDatasetLocks(nonExistentTestDatasetId)).rejects.toThrow(expectedError)
    })
  })

  describe('getDatasetCitation', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should return citation when dataset exists', async () => {
      const actualDatasetCitation = await sut.getDatasetCitation(
        testDatasetIds.numericId,
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
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)
      await deaccessionDatasetViaApi(testDatasetIds.numericId, '1.0')

      const actualDatasetCitation = await sut.getDatasetCitation(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        true
      )

      expect(typeof actualDatasetCitation).toBe('string')
    })
  })

  describe('getDatasetCitationInOtherFormats', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should return citation in BibTeX format', async () => {
      const citation = await sut.getDatasetCitationInOtherFormats(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        CitationFormat.BibTeX
      )

      expect(typeof citation.content).toBe('string')
      expect(citation.contentType).toMatch(/text\/plain/)
    })

    test('should return citation in BibTeX format using persistent id', async () => {
      const citation = await sut.getDatasetCitationInOtherFormats(
        testDatasetIds.persistentId,
        DatasetNotNumberedVersion.LATEST,
        CitationFormat.BibTeX
      )

      expect(typeof citation.content).toBe('string')
      expect(citation.contentType).toMatch(/text\/plain/)
    })

    test('should return citation in RIS format', async () => {
      const citation = await sut.getDatasetCitationInOtherFormats(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        CitationFormat.RIS
      )

      expect(typeof citation.content).toBe('string')
      expect(citation.contentType).toMatch(/text\/plain/)
    })

    test('should return citation in CSLJson format', async () => {
      const citation = await sut.getDatasetCitationInOtherFormats(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        CitationFormat.CSLJson
      )

      expect(typeof citation.content).toBe('string')
      expect(citation.contentType).toMatch(/application\/json/)
    })

    test('should return citation in EndNote format', async () => {
      const citation = await sut.getDatasetCitationInOtherFormats(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        CitationFormat.EndNote
      )

      expect(typeof citation.content).toBe('string')
      expect(citation.contentType).toMatch(/text\/xml/)
    })

    test('should return citation in Internal format', async () => {
      const citation = await sut.getDatasetCitationInOtherFormats(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        CitationFormat.Internal
      )

      expect(typeof citation.content).toBe('string')
      expect(citation.contentType).toMatch(/text\/html/)
    })

    test('should return error when dataset does not exist', async () => {
      const nonExistentId = 9999999
      const expectedError = new ReadError(`[404] Dataset with ID ${nonExistentId} not found.`)

      await expect(
        sut.getDatasetCitationInOtherFormats(
          nonExistentId,
          DatasetNotNumberedVersion.LATEST,
          CitationFormat.RIS
        )
      ).rejects.toThrow(expectedError)
    })

    test('should return citation for deaccessioned dataset when includeDeaccessioned = true', async () => {
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)
      await deaccessionDatasetViaApi(testDatasetIds.numericId, '1.0')

      const citation = await sut.getDatasetCitationInOtherFormats(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        CitationFormat.RIS,
        true
      )

      expect(typeof citation.content).toBe('string')
      expect(citation.contentType).toMatch(/text\/plain/)
    })
  })

  describe('getDatasetVersionDiff', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeEach(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      // Dataset is in draft, so we need to publish it first
      await sut.publishDataset(testDatasetIds.numericId, VersionUpdateType.MAJOR)
      await waitForNoLocks(testDatasetIds.numericId, 10)
    })

    test('should return dataset metadata diff between two dataset versions', async () => {
      // Update dataset
      const metadataBlocksRepository = new MetadataBlocksRepository()
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName(
        'citation'
      )

      await sut.updateDataset(testDatasetIds.numericId, TEST_DIFF_DATASET_DTO, [
        citationMetadataBlock
      ])
      const actual = await sut.getDatasetVersionDiff(
        testDatasetIds.numericId,
        '1.0',
        DatasetNotNumberedVersion.DRAFT,
        false
      )
      expect(actual.metadataChanges?.[0]).not.toBeUndefined()
      expect(actual.metadataChanges?.[0].blockName).toEqual('Citation Metadata')
    })

    test('should return added file diff between two dataset versions', async () => {
      const fileMetadata = {
        description: 'test description',
        directoryLabel: 'directoryLabel',
        categories: ['category1', 'category2']
      }

      const uploadResponse = await uploadFileViaApi(
        testDatasetIds.numericId,
        testTextFile1Name,
        fileMetadata
      )

      const fileId = uploadResponse.data.data.files[0].dataFile.id
      const expectedFilesAdded = [
        {
          fileName: 'test-file-1.txt',
          type: 'text/plain',
          isRestricted: false,
          description: fileMetadata.description,
          filePath: fileMetadata.directoryLabel,
          categories: fileMetadata.categories,
          MD5: '68b22040025784da775f55cfcb6dee2e',
          fileId: fileId
        }
      ]
      const actual = await sut.getDatasetVersionDiff(
        testDatasetIds.numericId,
        '1.0',
        DatasetNotNumberedVersion.DRAFT,
        false
      )
      expect(actual.filesAdded).toEqual(expectedFilesAdded)
    })

    test('should return diff between :latestPublished and :draft', async () => {
      const fileMetadata = {
        description: 'test description',
        directoryLabel: 'directoryLabel',
        categories: ['category1', 'category2']
      }

      const uploadResponse = await uploadFileViaApi(
        testDatasetIds.numericId,
        testTextFile1Name,
        fileMetadata
      )

      const fileId = uploadResponse.data.data.files[0].dataFile.id
      const expectedFilesAdded = [
        {
          fileName: 'test-file-1.txt',
          type: 'text/plain',
          isRestricted: false,
          description: fileMetadata.description,
          filePath: fileMetadata.directoryLabel,
          categories: fileMetadata.categories,
          MD5: '68b22040025784da775f55cfcb6dee2e',
          fileId: fileId
        }
      ]
      const actual = await sut.getDatasetVersionDiff(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST_PUBLISHED,
        DatasetNotNumberedVersion.DRAFT,
        false
      )
      expect(actual.filesAdded).toEqual(expectedFilesAdded)
    })

    test('should return diff between :latestPublished deaccessioned and :draft when includeDeaccessioned param is true', async () => {
      await deaccessionDatasetViaApi(testDatasetIds.numericId, '1.0')

      const metadataBlocksRepository = new MetadataBlocksRepository()
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName(
        'citation'
      )

      await sut.updateDataset(testDatasetIds.numericId, TEST_DIFF_DATASET_DTO, [
        citationMetadataBlock
      ])

      const actual = await sut.getDatasetVersionDiff(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST_PUBLISHED,
        DatasetNotNumberedVersion.DRAFT,
        true
      )

      expect(actual).not.toBeUndefined()
      expect(actual.oldVersion.versionState).toBe('DEACCESSIONED')
      expect(actual.oldVersion.versionNumber).toBe('1.0')

      expect(actual.newVersion.versionState).toBe('DRAFT')
      expect(actual.newVersion.versionNumber).toBe('DRAFT')

      expect(actual.metadataChanges?.[0]).not.toBeUndefined()
      expect(actual.metadataChanges?.[0].blockName).toEqual('Citation Metadata')
    })

    afterEach(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })
  })

  describe('createDataset', () => {
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
        false,
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
      // even though we didn't provide a dataset type, it should be created with the default one
      expect(actualCreatedDataset.datasetType).toBe(defaultDatasetType)
    })
  })

  describe('createDatasetWithDatasetType', () => {
    test('should create a dataset with the provided dataset type', async () => {
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
        ROOT_COLLECTION_ALIAS,
        defaultDatasetType
      )
      const actualCreatedDataset = await sut.getDataset(
        createdDataset.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(actualCreatedDataset.datasetType).toBe(defaultDatasetType)
    })
  })

  describe('publishDataset', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should publish a new dataset version', async () => {
      const expectedMajorVersion = 1
      await waitForNoLocks(testDatasetIds.numericId, 10)

      await sut.publishDataset(testDatasetIds.numericId, VersionUpdateType.MAJOR)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const newDatasetVersion = await sut.getDataset(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
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

  describe('publish dataset with current version', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeEach(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    afterEach(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should update current dataset version keeping same version number', async () => {
      const expectedMajorVersion = 1

      await waitForNoLocks(testDatasetIds.numericId, 10)

      // Dataset is in draft, so we need to publish it first
      await sut.publishDataset(testDatasetIds.numericId, VersionUpdateType.MAJOR)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const datasetAfterFirstPublish = await sut.getDataset(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      // Update dataset
      const metadataBlocksRepository = new MetadataBlocksRepository()
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName(
        'citation'
      )
      await sut.updateDataset(testDatasetIds.numericId, TestConstants.TEST_NEW_DATASET_DTO, [
        citationMetadataBlock
      ])

      // Update current version
      await sut.publishDataset(testDatasetIds.numericId, VersionUpdateType.UPDATE_CURRENT)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const datasetAfterUpdatingCurrentVersion = await sut.getDataset(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(datasetAfterFirstPublish.versionInfo.majorNumber).toBe(expectedMajorVersion)
      expect(datasetAfterUpdatingCurrentVersion.versionInfo.majorNumber).toBe(expectedMajorVersion)
    })

    test('should return error when trying to publish with the current version a dataset that has never been published before', async () => {
      await waitForNoLocks(testDatasetIds.numericId, 10)

      await expect(
        sut.publishDataset(testDatasetIds.numericId, VersionUpdateType.UPDATE_CURRENT)
      ).rejects.toBeInstanceOf(WriteError)
    })
  })

  describe('updateDataset', () => {
    test('should update an existing dataset with the provided dataset citation fields', async () => {
      const testDataset = {
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
              subject: ['Medicine, Health and Life Sciences'],
              publication: [
                {
                  publicationRelationType: 'Cites',
                  publicationCitation: 'Some related publication citation',
                  publicationIDType: 'cstr',
                  publicationIDNumber: 'some identifier'
                }
              ],
              notesText: 'This is a note for the dataset.'
            }
          }
        ]
      }

      const metadataBlocksRepository = new MetadataBlocksRepository()
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName(
        'citation'
      )

      const createdDataset = await sut.createDataset(
        testDataset,
        [citationMetadataBlock],
        ROOT_COLLECTION_ALIAS
      )

      const actualCreatedDataset = await sut.getDataset(
        createdDataset.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(
        (actualCreatedDataset.metadataBlocks[0].fields.dsDescription[0] as DatasetDescription)
          .dsDescriptionValue
      ).toBe('This is the description of the dataset.')

      expect(actualCreatedDataset.metadataBlocks[0].fields.notesText as string).toBe(
        'This is a note for the dataset.'
      )
      expect(
        actualCreatedDataset.metadataBlocks[0].fields.publication as Publication[]
      ).toStrictEqual([
        {
          publicationRelationType: 'Cites',
          publicationCitation: 'Some related publication citation',
          publicationIDType: 'cstr',
          publicationIDNumber: 'some identifier'
        }
      ])

      const updatedDsDescription = 'This is the updated description of the dataset.'
      const updatedNotesText = ''
      const updatedPublication = [
        {
          publicationRelationType: '',
          publicationCitation: 'Some updated related publication citation',
          publicationIDType: '',
          publicationIDNumber: ''
        }
      ]

      testDataset.metadataBlockValues[0].fields.dsDescription[0].dsDescriptionValue =
        updatedDsDescription
      testDataset.metadataBlockValues[0].fields.notesText = updatedNotesText
      testDataset.metadataBlockValues[0].fields.publication = updatedPublication

      await sut.updateDataset(createdDataset.numericId, testDataset, [citationMetadataBlock])

      const actualUpdatedDataset = await sut.getDataset(
        createdDataset.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(actualUpdatedDataset.internalVersionNumber).toBe(2)
      expect(actualUpdatedDataset.metadataBlocks[0].fields.title).toBe(
        'Dataset created using the createDataset use case'
      )
      expect((actualUpdatedDataset.metadataBlocks[0].fields.author[0] as Author).authorName).toBe(
        'Admin, Dataverse'
      )
      expect(
        (actualUpdatedDataset.metadataBlocks[0].fields.author[0] as Author).authorAffiliation
      ).toBe('Dataverse.org')
      expect((actualUpdatedDataset.metadataBlocks[0].fields.author[1] as Author).authorName).toBe(
        'Owner, Dataverse'
      )
      expect(
        (actualUpdatedDataset.metadataBlocks[0].fields.author[1] as Author).authorAffiliation
      ).toBe('Dataversedemo.org')
      expect(
        (actualUpdatedDataset.metadataBlocks[0].fields.datasetContact[0] as DatasetContact)
          .datasetContactEmail
      ).toBe('finch@mailinator.com')
      expect(
        (actualUpdatedDataset.metadataBlocks[0].fields.datasetContact[0] as DatasetContact)
          .datasetContactName
      ).toBe('Finch, Fiona')
      expect(actualUpdatedDataset.metadataBlocks[0].fields.subject).toContain(
        'Medicine, Health and Life Sciences'
      )
      expect(
        (actualUpdatedDataset.metadataBlocks[0].fields.dsDescription[0] as DatasetDescription)
          .dsDescriptionValue
      ).toBe(updatedDsDescription)
      expect(actualUpdatedDataset.metadataBlocks[0].fields.notesText as string).toBe(undefined)
      expect(actualUpdatedDataset.metadataBlocks[0].fields.publication).toStrictEqual([
        {
          publicationCitation: 'Some updated related publication citation'
        }
      ])
    })

    test('should throw error if sending an outdated lastUpdateTime', async () => {
      const testDataset = {
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
        testDataset,
        [citationMetadataBlock],
        ROOT_COLLECTION_ALIAS
      )

      const actualCreatedDataset = await sut.getDataset(
        createdDataset.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )
      const firstLastUpdateTime = actualCreatedDataset.versionInfo.lastUpdateTime

      // Now update the dataset and then update again with the same source last update time
      const updatedDsDescription = 'This is the updated description of the dataset.'
      testDataset.metadataBlockValues[0].fields.dsDescription[0].dsDescriptionValue =
        updatedDsDescription

      // Wait for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // First update sending the correct lastUpdateTime
      await sut.updateDataset(
        createdDataset.numericId,
        testDataset,
        [citationMetadataBlock],
        firstLastUpdateTime
      )

      //Now try to update again with the previous lastUpdateTime
      const expectedError = new WriteError(
        `[400] Internal version timestamp ${firstLastUpdateTime} is outdated`
      )

      await expect(
        sut.updateDataset(
          createdDataset.numericId,
          testDataset,
          [citationMetadataBlock],
          firstLastUpdateTime
        )
      ).rejects.toThrow(expectedError)
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

  describe('deaccessionDataset', () => {
    test('should deaccession a dataset', async () => {
      const testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const deaccessionDTO: DatasetDeaccessionDTO = {
        deaccessionReason: 'Deaccessioning the dataset for testing purposes'
      }

      const actual = await sut.deaccessionDataset(testDatasetIds.numericId, '1.0', deaccessionDTO)

      expect(actual).toBeUndefined()

      const dataset = await sut.getDataset(testDatasetIds.numericId, '1.0', true, false)

      expect(dataset.versionInfo.state).toBe('DEACCESSIONED')
      expect(dataset.versionInfo.deaccessionNote).toBe(deaccessionDTO.deaccessionReason)
    })

    test('should return error when dataset is deaccessioned', async () => {
      const testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const deaccessionDTO: DatasetDeaccessionDTO = {
        deaccessionReason: 'Deaccessioning the dataset for testing purposes'
      }

      const actual = await sut.deaccessionDataset(testDatasetIds.numericId, '1.0', deaccessionDTO)

      expect(actual).toBeUndefined()

      await expect(
        sut.deaccessionDataset(testDatasetIds.numericId, '1.0', deaccessionDTO)
      ).rejects.toBeInstanceOf(WriteError)
    })

    test('should return error when dataset is not published', async () => {
      const testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

      const deaccessionDTO: DatasetDeaccessionDTO = {
        deaccessionReason: 'Deaccessioning the dataset for testing purposes'
      }

      await expect(
        sut.deaccessionDataset(testDatasetIds.numericId, ':latest-published', deaccessionDTO)
      ).rejects.toBeInstanceOf(WriteError)
    })

    test('should return error when dataset does not exist', async () => {
      await expect(
        sut.deaccessionDataset(nonExistentTestDatasetId, '1.0', {
          deaccessionReason: 'Deaccessioning the dataset for testing purposes'
        })
      ).rejects.toBeInstanceOf(WriteError)
    })
  })

  describe('getDatasetVersionsSummaries', () => {
    const testDatasetVersionsCollectionAlias = 'testDatasetVersionsCollection'

    beforeAll(async () => {
      await createCollectionViaApi(testDatasetVersionsCollectionAlias)
      await publishCollectionViaApi(testDatasetVersionsCollectionAlias)
      await setStorageDriverViaApi(testDatasetVersionsCollectionAlias, 'LocalStack')
    })

    afterAll(async () => {
      await deleteCollectionViaApi(testDatasetVersionsCollectionAlias)
    })

    test('should return dataset versions when dataset exists', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testDatasetVersionsCollectionAlias
      )

      const actual = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId)

      expect(actual.summaries.length).toBeGreaterThan(0)
      expect(actual.totalCount).toBeGreaterThan(0)
      expect(actual.summaries[0].versionNumber).toBe('DRAFT')
      expect(actual.summaries[0].summary).toBe(DatasetVersionSummaryStringValues.firstDraft)

      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    })

    test('should return dataset versions correctly after first publish', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testDatasetVersionsCollectionAlias
      )
      await publishDataset.execute(testDatasetIds.numericId, VersionUpdateType.MAJOR)

      await waitForNoLocks(testDatasetIds.numericId, 10)

      const actual = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId)

      expect(actual.summaries.length).toBeGreaterThan(0)
      expect(actual.totalCount).toBeGreaterThan(0)
      expect(actual.summaries[0].versionNumber).toBe('1.0')
      expect(actual.summaries[0].summary).toBe(DatasetVersionSummaryStringValues.firstPublished)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should return dataset versions correctly after deaccessioned', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testDatasetVersionsCollectionAlias
      )
      await publishDataset.execute(testDatasetIds.numericId, VersionUpdateType.MAJOR)

      await waitForNoLocks(testDatasetIds.numericId, 10)

      const deaccessionReason = {
        deaccessioned: { reason: 'Test reason.' }
      }
      await deaccessionDatasetViaApi(testDatasetIds.numericId, '1.0')

      const actual = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId)

      expect(actual.summaries.length).toBeGreaterThan(0)
      expect(actual.totalCount).toBeGreaterThan(0)
      expect(actual.summaries[0].versionNumber).toBe('1.0')
      expect(actual.summaries[0].summary).toStrictEqual(deaccessionReason)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should return dataset versions correctly after 1st publish and metadata fields update', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testDatasetVersionsCollectionAlias
      )
      await publishDataset.execute(testDatasetIds.numericId, VersionUpdateType.MAJOR)

      await waitForNoLocks(testDatasetIds.numericId, 10)

      const metadataBlocksRepository = new MetadataBlocksRepository()
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName(
        'citation'
      )

      await sut.updateDataset(
        testDatasetIds.numericId,
        {
          license: createDatasetLicenseModel(true),
          metadataBlockValues: [
            {
              name: 'citation',
              fields: {
                title: 'Updated Dataset Title'
              }
            }
          ]
        },
        [citationMetadataBlock]
      )

      const actual = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId)

      expect(actual.summaries.length).toEqual(2)
      expect(actual.totalCount).toEqual(2)
      expect(actual.summaries[0].versionNumber).toBe('DRAFT')
      expect(actual.summaries[0].summary).toMatchObject<DatasetVersionSummary>({
        'Citation Metadata': {
          Title: {
            added: 0,
            deleted: 0,
            changed: 1
          }
        },
        files: {
          added: 0,
          removed: 0,
          replaced: 0,
          changedFileMetaData: 0,
          changedVariableMetadata: 0
        },
        termsAccessChanged: false
      })

      expect(actual.summaries[1].versionNumber).toBe('1.0')
      expect(actual.summaries[1].summary).toBe(DatasetVersionSummaryStringValues.firstPublished)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should return correct files summary', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testDatasetVersionsCollectionAlias
      )
      await publishDataset.execute(testDatasetIds.numericId, VersionUpdateType.MAJOR)

      await waitForNoLocks(testDatasetIds.numericId, 10)

      const singlepartFile = await createSinglepartFileBlob()

      const destination = await createTestFileUploadDestination(
        singlepartFile,
        testDatasetIds.numericId
      )

      const actualStorageId = await directUploadSut.uploadFile(
        testDatasetIds.numericId,
        singlepartFile,
        jest.fn(),
        new AbortController(),
        destination
      )

      const fileArrayBuffer = await singlepartFile.arrayBuffer()
      const fileBuffer = Buffer.from(fileArrayBuffer)

      const uploadedFileDTO = {
        fileName: singlepartFile.name,
        storageId: actualStorageId,
        checksumType: 'md5',
        checksumValue: calculateBlobChecksum(fileBuffer, 'md5'),
        mimeType: singlepartFile.type
      }

      await filesRepositorySut.addUploadedFilesToDataset(testDatasetIds.numericId, [
        uploadedFileDTO
      ])

      const actual = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId)

      expect(actual.summaries.length).toEqual(2)
      expect(actual.totalCount).toEqual(2)

      expect(actual.summaries[0].versionNumber).toBe('DRAFT')
      expect(actual.summaries[0].summary).toMatchObject<DatasetVersionSummary>({
        files: {
          added: 1,
          removed: 0,
          replaced: 0,
          changedFileMetaData: 0,
          changedVariableMetadata: 0
        },
        termsAccessChanged: false
      })
      expect(actual.summaries[1].versionNumber).toBe('1.0')
      expect(actual.summaries[1].summary).toBe(DatasetVersionSummaryStringValues.firstPublished)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should return error when dataset does not exist', async () => {
      const expectedError = new ReadError(
        `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
      )

      await expect(sut.getDatasetVersionsSummaries(nonExistentTestDatasetId)).rejects.toThrow(
        expectedError
      )
    })

    test('should return dataset versions summaries with pagination', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testDatasetVersionsCollectionAlias
      )

      await publishDataset.execute(testDatasetIds.numericId, VersionUpdateType.MAJOR)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const metadataBlocksRepository = new MetadataBlocksRepository()
      const citationMetadataBlock = await metadataBlocksRepository.getMetadataBlockByName(
        'citation'
      )

      for (let i = 1; i <= 21; i++) {
        await sut.updateDataset(
          testDatasetIds.numericId,
          {
            metadataBlockValues: [
              {
                name: 'citation',
                fields: {
                  title: `Updated Dataset Title - Version ${i}`
                }
              }
            ]
          },
          [citationMetadataBlock]
        )

        await publishDataset.execute(testDatasetIds.numericId, VersionUpdateType.MINOR)
        await waitForNoLocks(testDatasetIds.numericId, 10)
      }

      const summaries = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId)
      console.log('summaries', summaries)

      const firstPage = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId, 5, 0)

      expect(firstPage.summaries.length).toBe(5)
      expect(firstPage.totalCount).toBe(22)
      expect(firstPage.summaries[0].versionNumber).toBe('1.21')
      expect(firstPage.summaries[4].versionNumber).toBe('1.17')

      // Test pagination with limit=5, offset=5 (second page)
      const secondPage = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId, 5, 5)
      expect(secondPage.summaries.length).toBe(5)
      expect(secondPage.totalCount).toBe(22)
      expect(secondPage.summaries[0].versionNumber).toBe('1.16')
      expect(secondPage.summaries[4].versionNumber).toBe('1.12')

      // Test pagination with limit=5, offset=10 (third page)
      const thirdPage = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId, 5, 10)
      expect(thirdPage.summaries.length).toBe(5)
      expect(thirdPage.totalCount).toBe(22)
      expect(thirdPage.summaries[0].versionNumber).toBe('1.11')
      expect(thirdPage.summaries[4].versionNumber).toBe('1.7')

      // Test that all versions are returned without pagination
      const allVersions = await sut.getDatasetVersionsSummaries(testDatasetIds.numericId)
      expect(allVersions.summaries.length).toBe(22) // 1 initial + 21 updates
      expect(allVersions.totalCount).toBe(22)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    }, 180000)
  })

  describe('getDatasetDownloadCount', () => {
    const testGetDatasetDownloadCountCollectionAlias = 'testGetDatasetDownloadCountCollection'
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      await createCollectionViaApi(testGetDatasetDownloadCountCollectionAlias)
      await publishCollectionViaApi(testGetDatasetDownloadCountCollectionAlias)
      testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testGetDatasetDownloadCountCollectionAlias
      )

      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      await deleteCollectionViaApi(testGetDatasetDownloadCountCollectionAlias)
    })

    test('should return download count for a dataset', async () => {
      const actual = await sut.getDatasetDownloadCount(testDatasetIds.numericId)

      expect(actual.downloadCount).toBe(0)
    })

    test('should return download count including MDC data', async () => {
      const actual = await sut.getDatasetDownloadCount(testDatasetIds.numericId, true)

      expect(actual.downloadCount).toBe(0)
    })

    test('should return download count including MDC data with persistent ID', async () => {
      const actual = await sut.getDatasetDownloadCount(testDatasetIds.persistentId, true)

      expect(actual.downloadCount).toBe(0)
    })

    test('should return error when dataset does not exist', async () => {
      await expect(sut.getDatasetDownloadCount(nonExistentTestDatasetId)).rejects.toBeInstanceOf(
        ReadError
      )
    })
  })

  describe('deleteDatasetDraft', () => {
    test('should delete a draft dataset', async () => {
      const testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

      await waitForNoLocks(testDatasetIds.numericId, 10)

      const actual = await sut.deleteDatasetDraft(testDatasetIds.numericId)

      expect(actual).toBeUndefined()

      const expectedError = new ReadError(
        `[404] Dataset with ID ${testDatasetIds.numericId} not found.`
      )

      await expect(
        sut.getDataset(testDatasetIds.numericId, DatasetNotNumberedVersion.LATEST, false, false)
      ).rejects.toThrow(expectedError)
    })

    test('should return error when dataset does not exist', async () => {
      const expectedError = new WriteError(
        `[404] Dataset with ID ${nonExistentTestDatasetId} not found.`
      )

      await expect(sut.deleteDatasetDraft(nonExistentTestDatasetId)).rejects.toThrow(expectedError)
    })
  })

  describe('linkDataset', () => {
    let testDatasetIds: CreatedDatasetIdentifiers
    const testCollectionAlias = 'testLinkDatasetCollection'

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      await createCollectionViaApi(testCollectionAlias)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      await deleteCollectionViaApi(testCollectionAlias)
    })

    test('should link a dataset to another collection', async () => {
      const actual = await sut.linkDataset(testDatasetIds.numericId, testCollectionAlias)

      expect(actual).toBeUndefined()

      const linkedCollections = await sut.getDatasetLinkedCollections(testDatasetIds.numericId)
      expect(linkedCollections[0].alias).toBe(testCollectionAlias)
    })

    test('should return error when dataset does not exist', async () => {
      await expect(sut.linkDataset(nonExistentTestDatasetId, testCollectionAlias)).rejects.toThrow()
    })

    test('should return error when collection does not exist', async () => {
      await expect(
        sut.linkDataset(testDatasetIds.numericId, 'nonExistentCollectionAlias')
      ).rejects.toThrow()
    })

    test('should link a dataset to another collection using persistent id', async () => {
      const persistentCollectionAlias = 'testLinkDatasetCollectionPersistent'
      await createCollectionViaApi(persistentCollectionAlias)

      const actual = await sut.linkDataset(testDatasetIds.persistentId, persistentCollectionAlias)

      expect(actual).toBeUndefined()

      const linkedCollections = await sut.getDatasetLinkedCollections(testDatasetIds.numericId)
      const aliases = linkedCollections.map((c) => c.alias)
      expect(aliases).toContain(persistentCollectionAlias)

      await deleteCollectionViaApi(persistentCollectionAlias)
    })
  })

  describe('unlinkDataset', () => {
    let testDatasetIds: CreatedDatasetIdentifiers
    const testCollectionAlias = 'testUnlinkDatasetCollection'

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      await createCollectionViaApi(testCollectionAlias)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      await deleteCollectionViaApi(testCollectionAlias)
    })

    test('should unlink a dataset from a collection', async () => {
      await sut.linkDataset(testDatasetIds.numericId, testCollectionAlias)
      const linkedCollections = await sut.getDatasetLinkedCollections(testDatasetIds.numericId)
      expect(linkedCollections[0].alias).toBe(testCollectionAlias)

      const actual = await sut.unlinkDataset(testDatasetIds.numericId, testCollectionAlias)

      expect(actual).toBeUndefined()
      const updatedLinkedCollections = await sut.getDatasetLinkedCollections(
        testDatasetIds.numericId
      )
      expect(updatedLinkedCollections.length).toBe(0)
    })

    test('should return error when dataset does not exist', async () => {
      await expect(sut.linkDataset(nonExistentTestDatasetId, testCollectionAlias)).rejects.toThrow()
    })

    test('should return error when collection does not exist', async () => {
      await expect(
        sut.linkDataset(testDatasetIds.numericId, 'nonExistentCollectionAlias')
      ).rejects.toThrow()
    })

    test('should return error when dataset is not linked to the collection', async () => {
      await expect(
        sut.unlinkDataset(testDatasetIds.numericId, testCollectionAlias)
      ).rejects.toThrow()
    })

    test('should unlink a dataset from a collection using persistent id', async () => {
      const persistentCollectionAlias = 'testUnlinkDatasetCollectionPersistent'
      await createCollectionViaApi(persistentCollectionAlias)

      await sut.linkDataset(testDatasetIds.persistentId, persistentCollectionAlias)
      const linkedCollections = await sut.getDatasetLinkedCollections(testDatasetIds.numericId)
      const aliases = linkedCollections.map((c) => c.alias)
      expect(aliases).toContain(persistentCollectionAlias)

      const actual = await sut.unlinkDataset(testDatasetIds.persistentId, persistentCollectionAlias)

      expect(actual).toBeUndefined()
      const updatedLinkedCollections = await sut.getDatasetLinkedCollections(
        testDatasetIds.numericId
      )
      const updatedAliases = updatedLinkedCollections.map((c) => c.alias)
      expect(updatedAliases).not.toContain(persistentCollectionAlias)

      await deleteCollectionViaApi(persistentCollectionAlias)
    })
  })

  describe('getDatasetLinkedCollections', () => {
    let testDatasetIds: CreatedDatasetIdentifiers
    const testCollectionAlias = 'testGetLinkedCollections'

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
      await createCollectionViaApi(testCollectionAlias)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      await deleteCollectionViaApi(testCollectionAlias)
    })

    test('should return empty array when no collections are linked', async () => {
      const linkedCollections = await sut.getDatasetLinkedCollections(testDatasetIds.numericId)

      expect(linkedCollections.length).toBe(0)
    })

    test('should return linked collections for a dataset', async () => {
      await sut.linkDataset(testDatasetIds.numericId, testCollectionAlias)

      const linkedCollections = await sut.getDatasetLinkedCollections(testDatasetIds.numericId)

      expect(linkedCollections.length).toBe(1)
      expect(linkedCollections[0].alias).toBe(testCollectionAlias)
    })

    test('should return error when dataset does not exist', async () => {
      await expect(sut.getDatasetLinkedCollections(nonExistentTestDatasetId)).rejects.toThrow()
    })
  })

  describe('getDatasetAvailableCategories', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    afterAll(async () => {
      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })

    test('should get available categories', async () => {
      const fileMetadata = {
        description: 'test description',
        directoryLabel: 'directoryLabel',
        categories: ['category1', 'category2', 'Documentation', 'Data', 'Code']
      }

      await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name, fileMetadata)

      const actual = await sut.getDatasetAvailableCategories(testDatasetIds.numericId)
      expect(actual.sort()).toEqual(fileMetadata.categories.sort())
    })

    test('should get available categorie if dataset id is persistent id', async () => {
      const fileMetadata = {
        description: 'test description',
        directoryLabel: 'directoryLabel',
        categories: ['category1', 'category2', 'Documentation', 'Data', 'Code']
      }

      const actual = await sut.getDatasetAvailableCategories(testDatasetIds.persistentId)
      expect(actual.sort()).toEqual(fileMetadata.categories.sort())
    })

    test('should return error when dataset does not exist', async () => {
      await expect(sut.getDatasetAvailableCategories(nonExistentTestDatasetId)).rejects.toThrow()
    })
  })

  describe('getDatasetTemplates', () => {
    const testCollectionAlias = 'testGetDatasetTemplates'

    beforeAll(async () => {
      await createCollectionViaApi(testCollectionAlias)
    })

    afterAll(async () => {
      await deleteCollectionViaApi(testCollectionAlias)
    })

    test('should return empty dataset templates', async () => {
      const actual = await sut.getDatasetTemplates(testCollectionAlias)

      expect(actual.length).toBe(0)
    })

    test('should return dataset templates for a collection', async () => {
      const templateCreated = await createDatasetTemplateViaApi(testCollectionAlias)

      const actual = await sut.getDatasetTemplates(testCollectionAlias)

      expect(actual.length).toBe(1)

      expect(actual[0].name).toBe(templateCreated.name)
      expect(actual[0].isDefault).toBe(templateCreated.isDefault)
      expect(actual[0].datasetMetadataBlocks.length).toBe(1)
      expect(actual[0].datasetMetadataBlocks[0].name).toBe('citation')
      expect(actual[0].datasetMetadataBlocks[0].fields.author.length).toBe(1)
      expect(actual[0].instructions.length).toBe(templateCreated.instructions.length)

      await deleteDatasetTemplateViaApi(actual[0].id)
    })
  })

  describe('getDatasetAvailableDatasetTypes', () => {
    test('should return available dataset types', async () => {
      const actualDatasetTypes: DatasetType[] = await getDatasetAvailableDatasetTypes.execute()
      const expectedDatasetTypes = [
        {
          id: 1,
          name: 'dataset',
          linkedMetadataBlocks: [],
          availableLicenses: []
        }
      ]

      expect(actualDatasetTypes).toEqual(expectedDatasetTypes)
    })
  })

  describe('getDatasetAvailableDatasetType', () => {
    test('should return available the default dataset type', async () => {
      const defaultDatasetType = 'dataset'
      const actualDatasetType: DatasetType = await getDatasetAvailableDatasetType.execute(
        defaultDatasetType
      )
      const expectedDatasetType = {
        id: 1,
        name: 'dataset',
        linkedMetadataBlocks: [],
        availableLicenses: []
      }

      expect(actualDatasetType).toEqual(expectedDatasetType)
    })
  })

  describe('addDatasetType', () => {
    test('should add a dataset type', async () => {
      const randomName = `datasetType-${crypto.randomUUID().slice(0, 6)}`
      const actual: DatasetType = await addDatasetType.execute({
        name: randomName,
        linkedMetadataBlocks: [],
        availableLicenses: []
      })

      expect(actual.name).toEqual(randomName)
    })
  })

  describe('deleteDatasetType', () => {
    test('should delete a dataset type (after adding it)', async () => {
      const randomName = `datasetType-${crypto.randomUUID().slice(0, 6)}`
      const actual: DatasetType = await addDatasetType.execute({
        name: randomName,
        linkedMetadataBlocks: [],
        availableLicenses: []
      })
      expect(actual.name).toEqual(randomName)

      const deleted: void = await deleteDatasetType.execute(actual.id as number)
      expect(deleted).toEqual({ message: 'deleted' })
    })
  })

  describe('linkDatasetTypeWithMetadataBlocks', () => {
    test('should allow for linking a dataset type to metadata blocks', async () => {
      const randomName = `datasetType-${crypto.randomUUID().slice(0, 6)}`
      const actual: DatasetType = await addDatasetType.execute({
        name: randomName,
        linkedMetadataBlocks: [],
        availableLicenses: []
      })
      expect(actual.name).toEqual(randomName)

      const linked: void = await linkDatasetTypeWithMetadataBlocks.execute(actual.id as number, [
        'geospatial'
      ])
      expect(linked).toEqual({
        linkedMetadataBlocks: {
          before: [],
          after: ['geospatial']
        }
      })
    })
  })

  describe('setAvailableLicensesForDatasetType', () => {
    test('should allow for setting available licenses for a dataset type', async () => {
      const randomName = `datasetType-${crypto.randomUUID().slice(0, 6)}`
      const actual: DatasetType = await addDatasetType.execute({
        name: randomName,
        linkedMetadataBlocks: [],
        availableLicenses: []
      })
      expect(actual.name).toEqual(randomName)

      const linked: void = await setAvailableLicensesForDatasetType.execute(actual.id as number, [
        'CC BY 4.0'
      ])
      expect(linked).toEqual({
        availableLicenses: {
          before: [],
          after: ['CC BY 4.0']
        }
      })
    })
  })

  describe('updateTermsOfAccess', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    beforeAll(async () => {
      testDatasetIds = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)
    })

    test('should update the terms of access for a dataset', async () => {
      const datasetBefore = await sut.getDataset(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      const termsOfAccessBefore: TermsOfAccess = {
        fileAccessRequest: true,
        termsOfAccessForRestrictedFiles: undefined,
        dataAccessPlace: undefined,
        originalArchive: undefined,
        availabilityStatus: undefined,
        contactForAccess: undefined,
        sizeOfCollection: undefined,
        studyCompletion: undefined
      }
      expect(datasetBefore.termsOfUse.termsOfAccess).toEqual(termsOfAccessBefore)

      const termsOfAccessAfter: TermsOfAccess = {
        fileAccessRequest: false,
        termsOfAccessForRestrictedFiles: 'Your terms of access for restricted files',
        dataAccessPlace: 'Your data access place',
        originalArchive: 'Your original archive',
        availabilityStatus: 'Your availability status',
        contactForAccess: 'Your contact for access',
        sizeOfCollection: 'Your size of collection',
        studyCompletion: 'Your study completion'
      }

      await updateTermsOfAccess.execute(testDatasetIds.numericId, termsOfAccessAfter)

      const datasetAfter = await sut.getDataset(
        testDatasetIds.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(datasetAfter.termsOfUse.termsOfAccess).toEqual(termsOfAccessAfter)
    })

    test('should throw error when dataset does not exist', async () => {
      const nonExistentId = 999999
      await expect(
        updateTermsOfAccess.execute(nonExistentId, {
          fileAccessRequest: true
        })
      ).rejects.toBeInstanceOf(WriteError)
    })

    test('should accept only fileAccessRequest field', async () => {
      const ids = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

      await updateTermsOfAccess.execute(ids.numericId, {
        fileAccessRequest: false
      })

      const dataset = await sut.getDataset(
        ids.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(dataset.termsOfUse.termsOfAccess.fileAccessRequest).toBe(false)
      expect(dataset.termsOfUse.termsOfAccess.dataAccessPlace).toBeUndefined()
      expect(dataset.termsOfUse.termsOfAccess.originalArchive).toBeUndefined()
      expect(dataset.termsOfUse.termsOfAccess.availabilityStatus).toBeUndefined()
      expect(dataset.termsOfUse.termsOfAccess.contactForAccess).toBeUndefined()
      expect(dataset.termsOfUse.termsOfAccess.sizeOfCollection).toBeUndefined()
      expect(dataset.termsOfUse.termsOfAccess.studyCompletion).toBeUndefined()
    })

    test('should work when identifying dataset by persistent id', async () => {
      const ids = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

      await updateTermsOfAccess.execute(ids.persistentId, {
        termsOfAccessForRestrictedFiles: 'Persistent terms',
        fileAccessRequest: false
      })

      const dataset = await sut.getDataset(
        ids.persistentId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(dataset.persistentId).toBe(ids.persistentId)
      expect(dataset.termsOfUse.termsOfAccess.fileAccessRequest).toBe(false)
      expect(dataset.termsOfUse.termsOfAccess.termsOfAccessForRestrictedFiles).toBe(
        'Persistent terms'
      )
    })

    test('should update terms on a published dataset (creates a draft)', async () => {
      const ids = await createDataset.execute(TestConstants.TEST_NEW_DATASET_DTO)

      await publishDataset.execute(ids.numericId, VersionUpdateType.MAJOR)
      await waitForNoLocks(ids.numericId, 10)

      await updateTermsOfAccess.execute(ids.numericId, {
        fileAccessRequest: true,
        termsOfAccessForRestrictedFiles: 'Updated after publish'
      })

      await waitForNoLocks(ids.numericId, 10)

      const dataset = await sut.getDataset(
        ids.numericId,
        DatasetNotNumberedVersion.LATEST,
        false,
        false
      )

      expect(dataset.versionInfo.state).toBe('DRAFT')
      expect(dataset.termsOfUse.termsOfAccess.termsOfAccessForRestrictedFiles).toBe(
        'Updated after publish'
      )

      await deletePublishedDatasetViaApi(ids.persistentId)
    })
  })
})
