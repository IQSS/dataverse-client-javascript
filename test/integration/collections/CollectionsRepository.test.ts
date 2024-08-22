import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  CreatedDatasetIdentifiers,
  DatasetPreview,
  FilePreview,
  ReadError,
  WriteError,
  createDataset
} from '../../../src'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionDTO,
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'
import { uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'
import { PublicationStatus } from '../../../src/core/domain/models/PublicationStatus'

describe('CollectionsRepository', () => {
  const testCollectionAlias = 'collectionsRepositoryTestCollection'
  const sut: CollectionsRepository = new CollectionsRepository()
  let testCollectionId: number

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(testCollectionAlias).then(
      (collectionPayload: CollectionPayload) => (testCollectionId = collectionPayload.id)
    )
  })

  afterAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await deleteCollectionViaApi(testCollectionAlias)
  })

  describe('getCollection', () => {
    describe('by default `root` Id', () => {
      test('should return the root collection of the Dataverse installation if no parameter is passed AS `root`', async () => {
        const actual = await sut.getCollection()
        expect(actual.alias).toBe(ROOT_COLLECTION_ALIAS)
        expect(actual.id).toBe(1)
        expect(actual.name).toBe('Root')
        expect(actual.alias).toBe('root')
        expect(actual.isReleased).toBe(true)
        expect(actual.affiliation).toBe(undefined)
        expect(actual.description).toBe('The root dataverse.')
        expect(actual.inputLevels).toBe(undefined)
      })

      test('should return isReleased is true for root collection', async () => {
        const actual = await sut.getCollection()
        expect(actual.alias).toBe(ROOT_COLLECTION_ALIAS)
        expect(actual.isReleased).toBe(true)
      })
    })
    describe('by string alias', () => {
      test('should return collection when it exists filtering by id AS (alias)', async () => {
        const actual = await sut.getCollection(testCollectionAlias)
        expect(actual.alias).toBe(testCollectionAlias)
      })
      test('should return isReleased is false for unpublished collection', async () => {
        const actual = await sut.getCollection(testCollectionAlias)
        expect(actual.alias).toBe(testCollectionAlias)
        expect(actual.isReleased).toBe(false)
      })
      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ALIAS}'`
        )

        await expect(sut.getCollection(TestConstants.TEST_DUMMY_COLLECTION_ALIAS)).rejects.toThrow(
          expectedError
        )
      })
    })
    describe('by numeric id', () => {
      test('should return collection when it exists filtering by id AS (id)', async () => {
        const actual = await sut.getCollection(testCollectionId)
        expect(actual.id).toBe(testCollectionId)
      })

      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
        )

        await expect(sut.getCollection(TestConstants.TEST_DUMMY_COLLECTION_ID)).rejects.toThrow(
          expectedError
        )
      })
    })
  })

  describe('createCollection', () => {
    const testCreateCollectionAlias1 = 'createCollection-test-1'
    const testCreateCollectionAlias2 = 'createCollection-test-2'

    afterAll(async () => {
      await deleteCollectionViaApi(testCreateCollectionAlias1)
      await deleteCollectionViaApi(testCreateCollectionAlias2)
    })

    test('should create collection in root when no parent collection is set', async () => {
      const newCollectionDTO = createCollectionDTO(testCreateCollectionAlias1)
      const actualId = await sut.createCollection(newCollectionDTO)
      expect(typeof actualId).toBe('number')

      const createdCollection = await sut.getCollection(actualId)
      expect(createdCollection.id).toBe(actualId)
      expect(createdCollection.alias).toBe(newCollectionDTO.alias)
      expect(createdCollection.name).toBe(newCollectionDTO.name)
      expect(createdCollection.affiliation).toBe(newCollectionDTO.affiliation)
      expect(createdCollection.isPartOf.type).toBe('DATAVERSE')
      expect(createdCollection.isPartOf.displayName).toBe('Root')
      expect(createdCollection.isPartOf.identifier).toBe('root')

      expect(createdCollection.inputLevels?.length).toBe(1)
      const inputLevel = createdCollection.inputLevels?.[0]
      expect(inputLevel?.datasetFieldName).toBe('geographicCoverage')
      expect(inputLevel?.include).toBe(true)
      expect(inputLevel?.required).toBe(true)
    })

    test('should create collection in parent collection when parent collection is set', async () => {
      const actualId = await sut.createCollection(
        createCollectionDTO(testCreateCollectionAlias2),
        testCollectionId
      )
      expect(typeof actualId).toBe('number')
    })

    test('should return error when parent collection does not exist', async () => {
      const expectedError = new WriteError(
        `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
      )
      const testCreateCollectionAlias3 = 'createCollection-test-3'
      await expect(
        sut.createCollection(
          createCollectionDTO(testCreateCollectionAlias3),
          TestConstants.TEST_DUMMY_COLLECTION_ID
        )
      ).rejects.toThrow(expectedError)
    })
  })

  describe('getCollectionFacets', () => {
    test('should return collection facets given a valid collection alias', async () => {
      const actual = await sut.getCollectionFacets(testCollectionAlias)
      expect(actual).toContain('authorName')
      expect(actual).toContain('subject')
      expect(actual).toContain('keywordValue')
      expect(actual).toContain('dateOfDeposit')
    })

    test('should return error when collection does not exist', async () => {
      const expectedError = new ReadError(
        `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ALIAS}'`
      )

      await expect(
        sut.getCollectionFacets(TestConstants.TEST_DUMMY_COLLECTION_ALIAS)
      ).rejects.toThrow(expectedError)
    })
  })

  describe('getCollectionItems', () => {
    let testDatasetIds: CreatedDatasetIdentifiers
    const testTextFile1Name = 'test-file-1.txt'

    beforeAll(async () => {
      try {
        testDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testCollectionAlias
        )
      } catch (error) {
        throw new Error('Tests beforeAll(): Error while creating test dataset')
      }
      await uploadFileViaApi(testDatasetIds.numericId, testTextFile1Name).catch(() => {
        throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile1Name}`)
      })
    })

    afterAll(async () => {
      try {
        await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
      } catch (error) {
        throw new Error('Tests afterAll(): Error while deleting test dataset')
      }
    })

    test('should return collection items given a valid collection alias', async () => {
      // Give enough time to Solr for indexing
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const actual = await sut.getCollectionItems(testCollectionAlias)
      const actualFilePreview = actual.items[0] as FilePreview
      const actualDatasetPreview = actual.items[1] as DatasetPreview

      const expectedFileMd5 = '68b22040025784da775f55cfcb6dee2e'
      const expectedDatasetCitationFragment =
        'Admin, Dataverse; Owner, Dataverse, 2024, "Dataset created using the createDataset use case'

      expect(actualFilePreview.checksum?.type).toBe('MD5')
      expect(actualFilePreview.checksum?.value).toBe(expectedFileMd5)
      expect(actualFilePreview.datasetCitation).toContain(expectedDatasetCitationFragment)
      expect(actualFilePreview.datasetId).toBe(testDatasetIds.numericId)
      expect(actualFilePreview.datasetName).toBe('Dataset created using the createDataset use case')
      expect(actualFilePreview.datasetPersistentId).toBe(testDatasetIds.persistentId)
      expect(actualFilePreview.description).toBe('')
      expect(actualFilePreview.fileContentType).toBe('text/plain')
      expect(actualFilePreview.fileId).not.toBeUndefined()
      expect(actualFilePreview.fileType).toBe('file')
      expect(actualFilePreview.md5).toBe(expectedFileMd5)
      expect(actualFilePreview.name).toBe('test-file-1.txt')
      expect(actualFilePreview.publicationStatuses[0]).toBe(PublicationStatus.Unpublished)
      expect(actualFilePreview.publicationStatuses[1]).toBe(PublicationStatus.Draft)
      expect(actualFilePreview.sizeInBytes).toBe(12)
      expect(actualFilePreview.url).toBe('http://localhost:8080/api/access/datafile/17')

      expect(actualDatasetPreview.title).toBe('Dataset created using the createDataset use case')
      expect(actualDatasetPreview.citation).toContain(expectedDatasetCitationFragment)
      expect(actualDatasetPreview.description).toBe('This is the description of the dataset.')
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.publicationStatuses[0]).toBe(PublicationStatus.Unpublished)
      expect(actualDatasetPreview.publicationStatuses[1]).toBe(PublicationStatus.Draft)
      expect(actualDatasetPreview.versionId).toBe(8)
      expect(actualDatasetPreview.versionInfo.createTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.lastUpdateTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.majorNumber).toBeUndefined()
      expect(actualDatasetPreview.versionInfo.minorNumber).toBeUndefined()
      expect(actualDatasetPreview.versionInfo.state).toBe('DRAFT')

      expect(actual.totalItemCount).toBe(2)
    })

    test('should return error when collection does not exist', async () => {
      const expectedError = new ReadError(
        `[400] Could not find dataverse with alias ${TestConstants.TEST_DUMMY_COLLECTION_ALIAS}`
      )

      await expect(
        sut.getCollectionItems(TestConstants.TEST_DUMMY_COLLECTION_ALIAS)
      ).rejects.toThrow(expectedError)
    })
  })
})
