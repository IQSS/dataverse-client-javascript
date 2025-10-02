import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import {
  CollectionDTO,
  CollectionItemType,
  CollectionPreview,
  CollectionSearchCriteria,
  CreatedDatasetIdentifiers,
  DatasetPreview,
  FilePreview,
  ReadError,
  WriteError,
  createDataset,
  getCollection,
  createCollection,
  getDatasetFiles,
  restrictFile,
  deleteFile,
  linkDataset
} from '../../../src'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionDTO,
  createCollectionViaApi,
  deleteCollectionViaApi,
  publishCollectionViaApi,
  ROOT_COLLECTION_ALIAS
} from '../../testHelpers/collections/collectionHelper'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'
import { updateFileTabularTags, uploadFileViaApi } from '../../testHelpers/files/filesHelper'
import {
  deletePublishedDatasetViaApi,
  deleteUnpublishedDatasetViaApi,
  publishDatasetViaApi,
  waitForNoLocks
} from '../../testHelpers/datasets/datasetHelper'
import { PublicationStatus } from '../../../src/core/domain/models/PublicationStatus'
import { CollectionType } from '../../../src/collections/domain/models/CollectionType'
import {
  OrderType,
  SortType
} from '../../../src/collections/domain/models/CollectionSearchCriteria'
import { ROOT_COLLECTION_ID } from '../../../src/collections/domain/models/Collection'
import {
  createCollectionCustomFeaturedItemViaApi,
  createCollectionDvObjectFeaturedItemViaApi,
  createImageFile,
  deleteCollectionFeaturedItemsViaApi,
  deleteCollectionFeaturedItemViaApi
} from '../../testHelpers/collections/collectionFeaturedItemsHelper'
import { createApiTokenViaApi } from '../../testHelpers/users/apiTokenHelper'
import {
  CustomFeaturedItem,
  FeaturedItemType
} from '../../../src/collections/domain/models/FeaturedItem'
import {
  DvObjectFeaturedItemDTO,
  FeaturedItemsDTO
} from '../../../src/collections/domain/dtos/FeaturedItemsDTO'

describe('CollectionsRepository', () => {
  const testCollectionAlias = 'collectionsRepositoryTestCollection'
  const sut: CollectionsRepository = new CollectionsRepository()
  let testCollectionId: number
  const currentYear = new Date().getFullYear()

  beforeAll(async () => {
    // create builtin user and pass API key to APiConfig
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
        expect(actual.type).toBe(CollectionType.UNCATEGORIZED)
        expect(actual.contacts).toEqual([{ email: 'root@mailinator.com', displayOrder: 0 }])
        expect(actual.isMetadataBlockRoot).toBe(true)
        expect(actual.isFacetRoot).toBe(true)
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

    test('should return childCount correctly', async () => {
      const parentCollectionAlias = 'childCountTestCollection'
      const childCollectionAlias = 'childCountTestChildCollection'

      await createCollectionViaApi(parentCollectionAlias, ROOT_COLLECTION_ALIAS)
      await createCollectionViaApi(childCollectionAlias, parentCollectionAlias)
      const { numericId: childDatasetNumericId } = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        parentCollectionAlias
      )

      const actual = await sut.getCollection(parentCollectionAlias)

      expect(actual.childCount).toBe(2)

      await deleteCollectionViaApi(childCollectionAlias)

      const actualAfterDeletion = await sut.getCollection(parentCollectionAlias)

      expect(actualAfterDeletion.childCount).toBe(1)

      await deleteUnpublishedDatasetViaApi(childDatasetNumericId)

      const actualAfterDatasetDeletion = await sut.getCollection(parentCollectionAlias)

      expect(actualAfterDatasetDeletion.childCount).toBe(0)
      await deleteCollectionViaApi(parentCollectionAlias)
    })
  })

  describe('publishCollection', () => {
    const testPublishCollectionAlias = 'publishCollection-test'

    afterAll(async () => {
      await deleteCollectionViaApi(testPublishCollectionAlias)
    })

    test('should publish a collection', async () => {
      const newCollectionDTO = createCollectionDTO(testPublishCollectionAlias)
      const actualId = await sut.createCollection(newCollectionDTO)
      await sut.publishCollection(actualId)
      const createdCollection = await sut.getCollection(actualId)

      expect(createdCollection.isReleased).toBe(true)
      expect(createdCollection.name).toBe(newCollectionDTO.name)
    })
  })

  describe('createCollection', () => {
    const testCreateCollectionAlias1 = 'createCollection-test-1'
    const testCreateCollectionAlias2 = 'createCollection-test-2'
    const testCreateCollectionAlias3 = 'createCollection-test-3'
    const testCreateCollectionAlias4 = 'createCollection-test-4'
    const testCreateCollectionAlias5 = 'createCollection-test-5'

    afterAll(async () => {
      await deleteCollectionViaApi(testCreateCollectionAlias1)
      await deleteCollectionViaApi(testCreateCollectionAlias2)
      await deleteCollectionViaApi(testCreateCollectionAlias3)
      await deleteCollectionViaApi(testCreateCollectionAlias4)
      await deleteCollectionViaApi(testCreateCollectionAlias5)
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
      expect(createdCollection.isPartOf.isReleased).toBe(true)

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

      const collectionCreated = await sut.getCollection(actualId)

      expect(collectionCreated.isMetadataBlockRoot).toBe(true)
      expect(collectionCreated.isFacetRoot).toBe(true)
    })

    test('should create a collection to inherit metadata blocks from parent collection', async () => {
      const childCollectionDTO = createCollectionDTO(testCreateCollectionAlias3)
      childCollectionDTO.inheritMetadataBlocksFromParent = true

      const childCollectionId = await sut.createCollection(childCollectionDTO)

      const childCollection = await sut.getCollection(childCollectionId)

      expect(childCollection.isMetadataBlockRoot).toBe(false)
      expect(childCollection.isFacetRoot).toBe(true)
    })

    test('should create a collection to inherit facets from parent collection', async () => {
      const childCollectionDTO = createCollectionDTO(testCreateCollectionAlias4)
      childCollectionDTO.inheritFacetsFromParent = true

      const childCollectionId = await sut.createCollection(childCollectionDTO)

      const childCollection = await sut.getCollection(childCollectionId)

      expect(childCollection.isMetadataBlockRoot).toBe(true)
      expect(childCollection.isFacetRoot).toBe(false)
    })

    test('should create a collection to inherit metadata blocks and facets from parent collection', async () => {
      const childCollectionDTO = createCollectionDTO(testCreateCollectionAlias5)
      childCollectionDTO.inheritMetadataBlocksFromParent = true
      childCollectionDTO.inheritFacetsFromParent = true

      const childCollectionId = await sut.createCollection(childCollectionDTO)

      const childCollection = await sut.getCollection(childCollectionId)

      expect(childCollection.isMetadataBlockRoot).toBe(false)
      expect(childCollection.isFacetRoot).toBe(false)
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

  describe('deleteCollection', () => {
    test('should delete collection successfully', async () => {
      const collectionAlias = 'deleteCollection-test'
      const collectionDTO = createCollectionDTO(collectionAlias)
      await sut.createCollection(collectionDTO)

      const createdCollection = await sut.getCollection(collectionAlias)

      expect(createdCollection.alias).toBe(collectionAlias)

      const deleteResult = await sut.deleteCollection(collectionAlias)
      const expectedError = new ReadError(
        `[404] Can't find dataverse with identifier='${collectionAlias}'`
      )

      expect(deleteResult).toBeUndefined()
      await expect(sut.getCollection(collectionAlias)).rejects.toThrow(expectedError)
    })

    test('should return error when collection does not exist', async () => {
      const expectedError = new WriteError(
        `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
      )
      await expect(sut.deleteCollection(TestConstants.TEST_DUMMY_COLLECTION_ID)).rejects.toThrow(
        expectedError
      )
    })
  })

  describe('getCollectionFacets', () => {
    test('should return collection facets given a valid collection alias', async () => {
      const actual = await sut.getCollectionFacets(testCollectionAlias)
      expect(actual.length).toBe(4)
      expect(actual[0].name).toBe('authorName')
      expect(actual[0].displayName).toBe('Author Name')
      expect(actual[0].id).not.toBe(undefined)
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

  describe('getCollectionUserPermissions', () => {
    test('should return user permissions', async () => {
      const actual = await sut.getCollectionUserPermissions('root')
      expect(actual.canAddDataset).toBe(true)
      expect(actual.canAddCollection).toBe(true)
      expect(actual.canDeleteCollection).toBe(true)
      expect(actual.canEditCollection).toBe(true)
      expect(actual.canManageCollectionPermissions).toBe(true)
      expect(actual.canPublishCollection).toBe(true)
      expect(actual.canViewUnpublishedCollection).toBe(true)
    })

    test('should return error when collection does not exist', async () => {
      const nonExistentCollectionAlias = 'nonExistentCollection'

      const expectedError = new ReadError(
        `[404] Can't find dataverse with identifier='${nonExistentCollectionAlias}'`
      )

      await expect(sut.getCollectionUserPermissions(nonExistentCollectionAlias)).rejects.toThrow(
        expectedError
      )
    })
  })

  describe('getCollectionItems', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    const testTextFile1Name = 'test-file-1.txt'
    const testSubCollectionAlias = 'collectionsRepositoryTestSubCollection'

    beforeAll(async () => {
      await createCollectionViaApi(testSubCollectionAlias, testCollectionAlias).catch(() => {
        throw new Error(
          `Tests beforeAll(): Error while creating subcollection ${testSubCollectionAlias}`
        )
      })
      try {
        testDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testSubCollectionAlias
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
        throw new Error(
          `Tests afterAll(): Error while deleting test dataset ${testDatasetIds.numericId}`
        )
      }
      try {
        await deleteCollectionViaApi(testSubCollectionAlias)
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while deleting subcollection ${testSubCollectionAlias}`
        )
      }
    })

    test('should return collection items given a valid collection alias', async () => {
      // Give enough time to Solr for indexing
      await new Promise((resolve) => setTimeout(resolve, 5000))

      let actual = await sut.getCollectionItems(testCollectionAlias)
      const actualFilePreview = actual.items[1] as FilePreview
      const actualDatasetPreview = actual.items[0] as DatasetPreview
      const actualCollectionPreview = actual.items[2] as CollectionPreview

      const expectedFileMd5 = '68b22040025784da775f55cfcb6dee2e'
      const expectedDatasetCitationFragment = `Admin, Dataverse; Owner, Dataverse, ${currentYear}, "Dataset created using the createDataset use case"`
      const expectedDatasetDescription = 'Dataset created using the createDataset use case'
      const expectedFileName = 'test-file-1.txt'
      const expectedCollectionsName = 'Scientific Research'

      //prettier-ignore
      const expectedFacetsAll = [
        {
          name: 'dvCategory', friendlyName: 'Dataverse Category', labels: [{ name: 'Laboratory', count: 1 }]
        },
        {
          name: 'publicationStatus', friendlyName: 'Publication Status', labels: [{ name: 'Unpublished', count: 3 },{ name: 'Draft', count: 2 }]
        },
        {
          name: 'authorName_ss', friendlyName: 'Author Name', labels: [{ name: 'Admin, Dataverse', count: 1 },{ name: 'Owner, Dataverse', count: 1 }]
        },
        {
          name: 'subject_ss', friendlyName: 'Subject', labels: [{ name: 'Medicine, Health and Life Sciences', count: 1 }]
        },
        {
          name: 'fileTypeGroupFacet', friendlyName: 'File Type', labels: [{ name: 'Text', count: 1 }]
        },
        {
          name: 'fileAccess', friendlyName: 'Access', labels: [{ name: 'Public', count: 1 }]
        }
      ]
      //prettier-ignore
      const expectedFacetsFromCollectionOnly = [
        {
          name: 'dvCategory', friendlyName: 'Dataverse Category', labels: [{ name: 'Laboratory', count: 1 }]
        },
        {
          name: 'publicationStatus', friendlyName: 'Publication Status', labels: [{ name: 'Unpublished', count: 1 }]
        }
      ]
      //prettier-ignore
      const expectedFacetsFromDatasetOnly = [
        {
          name: 'publicationStatus', friendlyName: 'Publication Status', labels: [{ name: 'Draft', count: 1 },{ name: 'Unpublished', count: 1 }]
        },
        {
          name: 'authorName_ss', friendlyName: 'Author Name', labels: [{ name: 'Admin, Dataverse', count: 1 },{ name: 'Owner, Dataverse', count: 1 }]
        },
        {
          name: 'subject_ss', friendlyName: 'Subject', labels: [{ name: 'Medicine, Health and Life Sciences', count: 1 }]
        }
      ]
      //prettier-ignore
      const expectedFacetsFromFileOnly = [
        {
          name: 'publicationStatus', friendlyName: 'Publication Status', labels: [{ name: 'Draft', count: 1 },{ name: 'Unpublished', count: 1 }]
        },
        { name: 'fileTypeGroupFacet', friendlyName: 'File Type', labels: [{ name: 'Text', count: 1 }] },
        { name: 'fileAccess', friendlyName: 'Access', labels: [{ name: 'Public', count: 1 }] }
      ]
      //prettier-ignore
      const expectedFacetsFromCollectionAndFile = [
        {
          name: 'dvCategory', friendlyName: 'Dataverse Category', labels: [{ name: 'Laboratory', count: 1 }]
        },
        {
          name: 'publicationStatus', friendlyName: 'Publication Status', labels: [{ name: 'Unpublished', count: 2 },{ name: 'Draft', count: 1 }]
        },
        { name: 'fileTypeGroupFacet', friendlyName: 'File Type', labels: [{ name: 'Text', count: 1 }] },
        { name: 'fileAccess', friendlyName: 'Access', labels: [{ name: 'Public', count: 1 }] }
      ]

      expect(actualFilePreview.checksum?.type).toBe('MD5')
      expect(actualFilePreview.checksum?.value).toBe(expectedFileMd5)
      expect(actualFilePreview.datasetCitation).toContain(expectedDatasetCitationFragment)
      expect(actualFilePreview.datasetId).toBe(testDatasetIds.numericId)
      expect(actualFilePreview.datasetName).toBe(expectedDatasetDescription)
      expect(actualFilePreview.datasetPersistentId).toBe(testDatasetIds.persistentId)
      expect(actualFilePreview.description).toBe('')
      expect(actualFilePreview.fileContentType).toBe('text/plain')
      expect(actualFilePreview.fileId).not.toBeUndefined()
      expect(actualFilePreview.fileType).toBe('Plain Text')
      expect(actualFilePreview.md5).toBe(expectedFileMd5)
      expect(actualFilePreview.name).toBe(expectedFileName)
      expect(actualFilePreview.publicationStatuses.length).toBe(2)
      expect(actualFilePreview.publicationStatuses).toContain(PublicationStatus.Unpublished)
      expect(actualFilePreview.publicationStatuses).toContain(PublicationStatus.Draft)
      expect(actualFilePreview.sizeInBytes).toBe(12)
      expect(actualFilePreview.url).not.toBeUndefined()
      expect(actualFilePreview.releaseOrCreateDate).not.toBeUndefined()
      expect(actualFilePreview.type).toBe(CollectionItemType.FILE)
      expect(actualFilePreview.restricted).toBe(false)
      expect(actualFilePreview.canDownloadFile).toBe(true)

      expect(actualDatasetPreview.title).toBe(expectedDatasetDescription)
      expect(actualDatasetPreview.citation).toContain(expectedDatasetCitationFragment)
      expect(actualDatasetPreview.description).toBe('This is the description of the dataset.')
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.publicationStatuses).toContain(PublicationStatus.Unpublished)
      expect(actualFilePreview.publicationStatuses).toContain(PublicationStatus.Draft)
      expect(actualDatasetPreview.versionId).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.createTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.lastUpdateTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.majorNumber).toBeUndefined()
      expect(actualDatasetPreview.versionInfo.minorNumber).toBeUndefined()
      expect(actualDatasetPreview.versionInfo.state).toBe('DRAFT')
      expect(actualDatasetPreview.parentCollectionAlias).toBe(
        'collectionsRepositoryTestSubCollection'
      )
      expect(actualDatasetPreview.parentCollectionName).toBe(expectedCollectionsName)
      expect(actualDatasetPreview.type).toBe(CollectionItemType.DATASET)

      expect(actualCollectionPreview.name).toBe(expectedCollectionsName)
      expect(actualCollectionPreview.alias).toBe(testSubCollectionAlias)
      expect(actualCollectionPreview.description).toBe('We do all the science.')
      expect(actualCollectionPreview.imageUrl).toBe(undefined)
      expect(actualCollectionPreview.parentAlias).toBe(testCollectionAlias)
      expect(actualCollectionPreview.parentName).toBe(expectedCollectionsName)
      expect(actualCollectionPreview.publicationStatuses).toContain(PublicationStatus.Unpublished)
      expect(actualCollectionPreview.releaseOrCreateDate).not.toBeUndefined()
      expect(actualCollectionPreview.affiliation).toBe('Scientific Research University')
      expect(actualCollectionPreview.parentAlias).toBe('collectionsRepositoryTestCollection')
      expect(actualCollectionPreview.parentName).toBe(expectedCollectionsName)
      expect(actualCollectionPreview.type).toBe(CollectionItemType.COLLECTION)

      expect(actual.totalItemCount).toBe(3)

      expect(actual.facets).toEqual(expectedFacetsAll)

      // Test limit and offset
      actual = await sut.getCollectionItems(testCollectionAlias, 1, 1)
      expect((actual.items[0] as FilePreview).name).toBe(expectedFileName)
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(3)

      // Test search text
      const collectionSearchCriteriaForFile = new CollectionSearchCriteria().withSearchText(
        'test-fi'
      )
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaForFile
      )
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as FilePreview).name).toBe(expectedFileName)

      const collectionSearchCriteriaForDataset = new CollectionSearchCriteria().withSearchText(
        'Dataset created using'
      )
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaForDataset
      )

      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as DatasetPreview).title).toBe(expectedDatasetDescription)

      const collectionSearchCriteriaForDatasetAndCollection =
        new CollectionSearchCriteria().withSearchText('the')
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaForDatasetAndCollection
      )
      expect(actual.totalItemCount).toBe(2)
      expect((actual.items[0] as DatasetPreview).title).toBe(expectedDatasetDescription)
      expect((actual.items[1] as CollectionPreview).name).toBe(expectedCollectionsName)

      // Test search text, limit and offset
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        1,
        1,
        collectionSearchCriteriaForDatasetAndCollection
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(2)
      expect((actual.items[0] as CollectionPreview).name).toBe(expectedCollectionsName)

      // Test type collection
      const collectionSearchCriteriaForCollectionType =
        new CollectionSearchCriteria().withItemTypes([CollectionItemType.COLLECTION])
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaForCollectionType
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as CollectionPreview).name).toBe(expectedCollectionsName)
      expect(actual.facets).toEqual(expectedFacetsFromCollectionOnly)

      // Test type dataset
      const collectionSearchCriteriaForDatasetType = new CollectionSearchCriteria().withItemTypes([
        CollectionItemType.DATASET
      ])
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaForDatasetType
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as DatasetPreview).title).toBe(expectedDatasetDescription)
      expect(actual.facets).toEqual(expectedFacetsFromDatasetOnly)

      // Test type file
      const collectionSearchCriteriaForFileType = new CollectionSearchCriteria().withItemTypes([
        CollectionItemType.FILE
      ])
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaForFileType
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as FilePreview).name).toBe(expectedFileName)
      expect(actual.facets).toEqual(expectedFacetsFromFileOnly)

      // Test multiple types
      const collectionSearchCriteriaForMultiTypes = new CollectionSearchCriteria().withItemTypes([
        CollectionItemType.FILE,
        CollectionItemType.COLLECTION
      ])
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaForMultiTypes
      )
      expect(actual.items.length).toBe(2)
      expect(actual.totalItemCount).toBe(2)
      expect((actual.items[0] as FilePreview).name).toBe(expectedFileName)
      expect((actual.items[1] as CollectionPreview).name).toBe(expectedCollectionsName)
      expect(actual.facets).toEqual(expectedFacetsFromCollectionAndFile)

      // Test Sort by name ascending
      const collectionSearchCriteriaNameAscending = new CollectionSearchCriteria()
        .withSort(SortType.NAME)
        .withOrder(OrderType.ASC)

      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaNameAscending
      )
      expect(actual.items.length).toBe(3)
      expect(actual.totalItemCount).toBe(3)
      expect((actual.items[0] as DatasetPreview).type).toBe(CollectionItemType.DATASET)
      expect((actual.items[1] as CollectionPreview).type).toBe(CollectionItemType.COLLECTION)
      expect((actual.items[2] as FilePreview).type).toBe(CollectionItemType.FILE)

      // Test Sort by name descending
      const collectionSearchCriteriaNameDescending = new CollectionSearchCriteria()
        .withSort(SortType.NAME)
        .withOrder(OrderType.DESC)

      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaNameDescending
      )
      expect(actual.items.length).toBe(3)
      expect(actual.totalItemCount).toBe(3)
      expect((actual.items[0] as FilePreview).type).toBe(CollectionItemType.FILE)
      expect((actual.items[1] as CollectionPreview).type).toBe(CollectionItemType.COLLECTION)
      expect((actual.items[2] as DatasetPreview).type).toBe(CollectionItemType.DATASET)

      // Test Sort by date ascending
      const collectionSearchCriteriaDateAscending = new CollectionSearchCriteria()
        .withSort(SortType.DATE)
        .withOrder(OrderType.ASC)

      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaDateAscending
      )
      expect(actual.items.length).toBe(3)
      expect(actual.totalItemCount).toBe(3)
      expect((actual.items[0] as CollectionPreview).type).toBe(CollectionItemType.COLLECTION)
      expect((actual.items[1] as DatasetPreview).type).toBe(CollectionItemType.DATASET)
      expect((actual.items[2] as FilePreview).type).toBe(CollectionItemType.FILE)

      // Test Sort by date descending
      const collectionSearchCriteriaDateDescending = new CollectionSearchCriteria()
        .withSort(SortType.DATE)
        .withOrder(OrderType.DESC)

      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaDateDescending
      )
      expect(actual.items.length).toBe(3)
      expect(actual.totalItemCount).toBe(3)
      expect((actual.items[0] as DatasetPreview).type).toBe(CollectionItemType.DATASET)
      expect((actual.items[1] as FilePreview).type).toBe(CollectionItemType.FILE)
      expect((actual.items[2] as CollectionPreview).type).toBe(CollectionItemType.COLLECTION)

      // Test with Filter query related to the collection
      const collectionSearchCriteriaFilterQueryCollection =
        new CollectionSearchCriteria().withFilterQueries(['dvCategory:Laboratory'])

      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaFilterQueryCollection
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as CollectionPreview).name).toBe(expectedCollectionsName)
      expect(actual.facets).toEqual(expectedFacetsFromCollectionOnly)

      // Test with Filter query related to the dataset
      const collectionSearchCriteriaFilterQueryDataset =
        new CollectionSearchCriteria().withFilterQueries([
          'subject_ss:Medicine, Health and Life Sciences'
        ])

      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaFilterQueryDataset
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as DatasetPreview).title).toBe(expectedDatasetDescription)
      expect(actual.facets).toEqual(expectedFacetsFromDatasetOnly)

      // Test with Filter query related to the file
      const collectionSearchCriteriaFilterQuerieCollAndFile =
        new CollectionSearchCriteria().withFilterQueries(['fileAccess:Public'])

      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        collectionSearchCriteriaFilterQuerieCollAndFile
      )

      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as FilePreview).name).toBe(expectedFileName)
      expect(actual.facets).toEqual(expectedFacetsFromFileOnly)

      // Test with showTypeCounts param in true
      actual = await sut.getCollectionItems(
        testCollectionAlias,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      )
      expect(actual.countPerObjectType?.collections).toBe(1)
      expect(actual.countPerObjectType?.datasets).toBe(1)
      expect(actual.countPerObjectType?.files).toBe(1)
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

  describe('getCollectionItems for published tabular file', () => {
    let testDatasetIds: CreatedDatasetIdentifiers
    const testTextFile4Name = 'test-file-4.tab'
    const testSubCollectionAlias = 'collectionsRepositoryTestSubCollection'

    beforeAll(async () => {
      await sut.publishCollection(testCollectionId).catch(() => {
        throw new Error(`Tests beforeAll(): Error while publishing collection ${testCollectionId}`)
      })

      const collectionPayload = await createCollectionViaApi(
        testSubCollectionAlias,
        testCollectionAlias
      ).catch(() => {
        throw new Error(
          `Tests beforeAll(): Error while creating subcollection ${testSubCollectionAlias}`
        )
      })

      await sut.publishCollection(collectionPayload.id).catch(() => {
        throw new Error(`Tests beforeAll(): Error while publishing collection ${testCollectionId}`)
      })

      try {
        testDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testSubCollectionAlias
        )
      } catch (error) {
        throw new Error('Tests beforeAll(): Error while creating test dataset')
      }
      const uploadFileViaApiResult = await uploadFileViaApi(
        testDatasetIds.numericId,
        testTextFile4Name,
        {
          categories: ['tabular data']
        }
      ).catch(() => {
        throw new Error(`Tests beforeAll(): Error while uploading file ${testTextFile4Name}`)
      })
      await new Promise((resolve) => setTimeout(resolve, 5000))

      await updateFileTabularTags(uploadFileViaApiResult.data.data.files[0].dataFile.id, [
        'Survey',
        'Genomics'
      ]).catch(() => {
        throw new Error(
          `Tests beforeAll(): Error while updating file tabular tags ${uploadFileViaApiResult.data.data.files[0].dataFile.id}`
        )
      })

      await publishDatasetViaApi(testDatasetIds.numericId).catch(() => {
        throw new Error(
          `Tests beforeAll(): Error while publishing dataset ${testDatasetIds.numericId}`
        )
      })
    })

    afterAll(async () => {
      try {
        await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while deleting test dataset ${testDatasetIds.persistentId}`
        )
      }
      try {
        await deleteCollectionViaApi(testSubCollectionAlias)
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while deleting subcollection ${testSubCollectionAlias}`
        )
      }
    })

    test('should return collection items given a valid collection alias', async () => {
      // Give enough time to Solr for indexing
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const actual = await sut.getCollectionItems(testCollectionAlias)
      const actualFilePreview = actual.items[1] as FilePreview
      const actualDatasetPreview = actual.items[0] as DatasetPreview
      const actualCollectionPreview = actual.items[2] as CollectionPreview

      const expectedFileMd5 = '77c7f03a7d7772907b43f0b322cef723'

      const expectedDatasetCitationFragment = `Admin, Dataverse; Owner, Dataverse, ${currentYear}, "Dataset created using the createDataset use case`
      const expectedDatasetDescription = 'Dataset created using the createDataset use case'
      const expectedFileName = 'test-file-4.tab'
      const expectedCollectionsName = 'Scientific Research'

      expect(actualFilePreview.checksum?.type).toBe('MD5')
      expect(actualFilePreview.checksum?.value).toBe(expectedFileMd5)
      expect(actualFilePreview.datasetCitation).toContain(expectedDatasetCitationFragment)
      expect(actualFilePreview.datasetId).toBe(testDatasetIds.numericId)
      expect(actualFilePreview.datasetName).toBe(expectedDatasetDescription)
      expect(actualFilePreview.datasetPersistentId).toBe(testDatasetIds.persistentId)
      expect(actualFilePreview.description).toBe('')
      expect(actualFilePreview.fileContentType).toBe('text/tab-separated-values')
      expect(actualFilePreview.fileId).not.toBeUndefined()
      expect(actualFilePreview.fileType).toBe('Tab-Delimited')
      expect(actualFilePreview.md5).toBe(expectedFileMd5)
      expect(actualFilePreview.name).toBe(expectedFileName)
      expect(actualFilePreview.publicationStatuses).toContain(PublicationStatus.Published)
      expect(actualFilePreview.sizeInBytes).toBe(137)
      expect(actualFilePreview.url).not.toBeUndefined()
      expect(actualFilePreview.releaseOrCreateDate).not.toBeUndefined()
      expect(actualFilePreview.type).toBe(CollectionItemType.FILE)
      expect(actualFilePreview.restricted).toBe(false)
      expect(actualFilePreview.canDownloadFile).toBe(true)
      expect(actualFilePreview.categories).toEqual(['tabular data'])
      expect(actualFilePreview.tabularTags).toEqual(['Genomics', 'Survey'])
      expect(actualFilePreview.observations).toBe(10)
      expect(actualFilePreview.variables).toBe(3)

      expect(actualDatasetPreview.title).toBe(expectedDatasetDescription)
      expect(actualDatasetPreview.citation).toContain(expectedDatasetCitationFragment)
      expect(actualDatasetPreview.description).toBe('This is the description of the dataset.')
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.publicationStatuses).toContain(PublicationStatus.Published)
      expect(actualDatasetPreview.versionId).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.createTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.lastUpdateTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.majorNumber).toBe(1)
      expect(actualDatasetPreview.versionInfo.minorNumber).toBe(0)
      expect(actualDatasetPreview.versionInfo.state).toBe('RELEASED')
      expect(actualDatasetPreview.parentCollectionAlias).toBe(
        'collectionsRepositoryTestSubCollection'
      )
      expect(actualDatasetPreview.parentCollectionName).toBe(expectedCollectionsName)
      expect(actualDatasetPreview.type).toBe(CollectionItemType.DATASET)

      expect(actualCollectionPreview.name).toBe(expectedCollectionsName)
      expect(actualCollectionPreview.alias).toBe(testSubCollectionAlias)
      expect(actualCollectionPreview.description).toBe('We do all the science.')
      expect(actualCollectionPreview.imageUrl).toBe(undefined)
      expect(actualCollectionPreview.parentAlias).toBe(testCollectionAlias)
      expect(actualCollectionPreview.parentName).toBe(expectedCollectionsName)
      expect(actualCollectionPreview.publicationStatuses).toContain(PublicationStatus.Published)
      expect(actualCollectionPreview.releaseOrCreateDate).not.toBeUndefined()
      expect(actualCollectionPreview.affiliation).toBe('Scientific Research University')
      expect(actualCollectionPreview.parentAlias).toBe('collectionsRepositoryTestCollection')
      expect(actualCollectionPreview.parentName).toBe(expectedCollectionsName)
      expect(actualCollectionPreview.type).toBe(CollectionItemType.COLLECTION)

      expect(actual.totalItemCount).toBe(3)
    })
  })

  describe('updateCollection', () => {
    const testUpdatedCollectionAlias = 'updateCollection-test-updatedAlias'

    afterAll(async () => {
      await deleteCollectionViaApi(testUpdatedCollectionAlias)
    })

    test('should update the collection', async () => {
      // First we create a test collection using a CollectionDTO and createCollection method
      const collectionDTO = createCollectionDTO('updatedCollection-test-originalAlias')
      const testUpdateCollectionId = await sut.createCollection(collectionDTO)
      const createdCollection = await sut.getCollection(testUpdateCollectionId)
      expect(createdCollection.id).toBe(testUpdateCollectionId)
      expect(createdCollection.alias).toBe(collectionDTO.alias)
      expect(createdCollection.name).toBe(collectionDTO.name)
      expect(createdCollection.affiliation).toBe(collectionDTO.affiliation)
      expect(createdCollection.inputLevels?.length).toBe(1)
      const inputLevel = createdCollection.inputLevels?.[0]
      expect(inputLevel?.datasetFieldName).toBe('geographicCoverage')
      expect(inputLevel?.include).toBe(true)
      expect(inputLevel?.required).toBe(true)

      // Now we update CollectionDTO and verify updates are correctly persisted after calling updateCollection method
      collectionDTO.alias = testUpdatedCollectionAlias
      const updatedCollectionName = 'updatedCollectionName'
      collectionDTO.name = updatedCollectionName
      const updatedCollectionAffiliation = 'updatedCollectionAffiliation'
      collectionDTO.affiliation = updatedCollectionAffiliation
      const updatedInputLevels = [
        {
          datasetFieldName: 'country',
          required: false,
          include: true
        }
      ]
      collectionDTO.inputLevels = updatedInputLevels
      await sut.updateCollection(testUpdateCollectionId, collectionDTO)
      const updatedCollection = await sut.getCollection(testUpdateCollectionId)
      expect(updatedCollection.id).toBe(testUpdateCollectionId)
      expect(updatedCollection.alias).toBe(testUpdatedCollectionAlias)
      expect(updatedCollection.name).toBe(updatedCollectionName)
      expect(updatedCollection.affiliation).toBe(updatedCollectionAffiliation)
      expect(updatedCollection.inputLevels?.length).toBe(2)
      const updatedInputLevel = updatedCollection.inputLevels?.[1]
      expect(updatedInputLevel?.datasetFieldName).toBe('country')
      expect(updatedInputLevel?.include).toBe(true)
      expect(updatedInputLevel?.required).toBe(false)
    })

    test('should update the collection to inherit metadata blocks from parent collection', async () => {
      const parentCollectionAlias = 'inherit-metablocks-parent-update'
      const parentCollectionDTO = createCollectionDTO(parentCollectionAlias)
      const parentCollectionId = await sut.createCollection(parentCollectionDTO)

      const childCollectionAlias = 'inherit-metablocks-child-update'
      const childCollectionDTO = createCollectionDTO(childCollectionAlias)

      const childCollectionId = await sut.createCollection(childCollectionDTO, parentCollectionId)

      const childCollection = await sut.getCollection(childCollectionId)

      expect(childCollection.isMetadataBlockRoot).toBe(true)
      expect(childCollection.isFacetRoot).toBe(true)

      const updatedChildCollectionDTO = createCollectionDTO(childCollectionAlias)
      updatedChildCollectionDTO.inheritMetadataBlocksFromParent = true

      await sut.updateCollection(childCollectionId, updatedChildCollectionDTO)

      const childCollectionAfterUpdate = await sut.getCollection(childCollectionId)

      expect(childCollectionAfterUpdate.isMetadataBlockRoot).toBe(false)
      expect(childCollectionAfterUpdate.isFacetRoot).toBe(true)

      await deleteCollectionViaApi(childCollectionAlias)
      await deleteCollectionViaApi(parentCollectionAlias)
    })

    test('should update the collection to inherit facets from parent collection', async () => {
      const parentCollectionAlias = 'inherit-facets-parent-update'
      const parentCollectionDTO = createCollectionDTO(parentCollectionAlias)
      const parentCollectionId = await sut.createCollection(parentCollectionDTO)

      const childCollectionAlias = 'inherit-facets-child-update'
      const childCollectionDTO = createCollectionDTO(childCollectionAlias)

      const childCollectionId = await sut.createCollection(childCollectionDTO, parentCollectionId)

      const childCollection = await sut.getCollection(childCollectionId)

      expect(childCollection.isMetadataBlockRoot).toBe(true)
      expect(childCollection.isFacetRoot).toBe(true)

      const updatedChildCollectionDTO = createCollectionDTO(childCollectionAlias)
      updatedChildCollectionDTO.inheritFacetsFromParent = true

      await sut.updateCollection(childCollectionId, updatedChildCollectionDTO)

      const childCollectionAfterUpdate = await sut.getCollection(childCollectionId)

      expect(childCollectionAfterUpdate.isMetadataBlockRoot).toBe(true)
      expect(childCollectionAfterUpdate.isFacetRoot).toBe(false)

      await deleteCollectionViaApi(childCollectionAlias)
      await deleteCollectionViaApi(parentCollectionAlias)
    })

    test('should update the collection to inherit metadata blocks and facets from parent collection', async () => {
      const parentCollectionAlias = 'inherit-metablocks-facets-parent-update'
      const parentCollectionDTO = createCollectionDTO(parentCollectionAlias)
      const parentCollectionId = await sut.createCollection(parentCollectionDTO)

      const childCollectionAlias = 'inherit-metablocks-facets-child-update'
      const childCollectionDTO = createCollectionDTO(childCollectionAlias)

      const childCollectionId = await sut.createCollection(childCollectionDTO, parentCollectionId)

      const childCollection = await sut.getCollection(childCollectionId)

      expect(childCollection.isMetadataBlockRoot).toBe(true)
      expect(childCollection.isFacetRoot).toBe(true)

      const updatedChildCollectionDTO = createCollectionDTO(childCollectionAlias)
      updatedChildCollectionDTO.inheritFacetsFromParent = true
      updatedChildCollectionDTO.inheritMetadataBlocksFromParent = true

      await sut.updateCollection(childCollectionId, updatedChildCollectionDTO)

      const childCollectionAfterUpdate = await sut.getCollection(childCollectionId)

      expect(childCollectionAfterUpdate.isMetadataBlockRoot).toBe(false)
      expect(childCollectionAfterUpdate.isFacetRoot).toBe(false)

      await deleteCollectionViaApi(childCollectionAlias)
      await deleteCollectionViaApi(parentCollectionAlias)
    })

    test('should not update root collection facets and keep isMetadataBlockRoot and isFacetRoot in true if facet ids are sent as undefined', async () => {
      const rootCollection = await sut.getCollection()

      const rootCollectionFacets = await sut.getCollectionFacets(rootCollection.alias)

      const updatedRootCollectionDTO: CollectionDTO = {
        alias: rootCollection.alias,
        name: rootCollection.name,
        contacts: [rootCollection.contacts?.[0].email as string],
        type: rootCollection.type,
        description: rootCollection.description,
        affiliation: rootCollection.affiliation,
        metadataBlockNames: undefined,
        facetIds: undefined,
        inputLevels: undefined,
        inheritFacetsFromParent: false,
        inheritMetadataBlocksFromParent: false
      }

      await sut.updateCollection(rootCollection.id, updatedRootCollectionDTO)

      const rootCollectionAfterUpdate = await sut.getCollection()

      const rootCollectionFacetsAfterUpdate = await sut.getCollectionFacets(rootCollection.alias)

      expect(rootCollectionFacets).toStrictEqual(rootCollectionFacetsAfterUpdate)
      expect(rootCollection.isMetadataBlockRoot).toBe(true)
      expect(rootCollection.isFacetRoot).toBe(true)
      expect(rootCollectionAfterUpdate.isMetadataBlockRoot).toBe(true)
      expect(rootCollectionAfterUpdate.isFacetRoot).toBe(true)
    })

    test('should return error when collection does not exist', async () => {
      const expectedError = new WriteError(
        `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
      )
      const testCollectionAlias = 'updateCollection-not-found-test'
      await expect(
        sut.updateCollection(
          TestConstants.TEST_DUMMY_COLLECTION_ID,
          createCollectionDTO(testCollectionAlias)
        )
      ).rejects.toThrow(expectedError)
    })
  })

  describe('getCollectionFeaturedItems', () => {
    test('should return empty featured items array given a valid collection alias when collection has no featured items', async () => {
      const featuredItemsResponse = await sut.getCollectionFeaturedItems(ROOT_COLLECTION_ID)

      expect(featuredItemsResponse).toStrictEqual([])
    })

    test('should return featured items array given a valid collection alias when collection has featured items', async () => {
      const featuredItemCreated = await createCollectionCustomFeaturedItemViaApi(
        testCollectionAlias,
        {
          content: '<p class="rte-paragraph">Test content</p>',
          displayOrder: 1,
          withFile: true,
          fileName: 'featured-item-test-image.png'
        }
      )

      const featuredItemsResponse = await sut.getCollectionFeaturedItems(testCollectionAlias)

      expect(featuredItemsResponse.length).toBe(1)
      const firstFeaturedItem = featuredItemsResponse[0] as CustomFeaturedItem
      expect(firstFeaturedItem.id).toBe(featuredItemCreated.id)
      expect(firstFeaturedItem.displayOrder).toBe(1)
      expect(firstFeaturedItem.content).toBe('<p class="rte-paragraph">Test content</p>')
      expect(firstFeaturedItem.imageFileUrl).toContain(
        `/api/access/dataverseFeaturedItemImage/${firstFeaturedItem.id}`
      )
      expect(firstFeaturedItem.imageFileName).toBe('featured-item-test-image.png')

      await deleteCollectionFeaturedItemViaApi(featuredItemCreated.id)
    })

    test('should return error when collection does not exist', async () => {
      const invalidCollectionAlias = 'invalid-collection-alias'
      const expectedError = new ReadError(
        `[404] Can't find dataverse with identifier='${invalidCollectionAlias}'`
      )

      await expect(sut.getCollectionFeaturedItems(invalidCollectionAlias)).rejects.toThrow(
        expectedError
      )
    })

    test('Featured Item type File should not be returned if the file was deleted and the dataset published', async () => {
      const testFileDeletedCollectionAlias = 'testCollectionFeaturedItemsFileDeletion'
      await createCollectionViaApi(testFileDeletedCollectionAlias)
      await publishCollectionViaApi(testFileDeletedCollectionAlias)
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testFileDeletedCollectionAlias
      )
      await uploadFileViaApi(testDatasetIds.numericId, 'test-file-1.txt')
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
      const fileId = datasetFiles.files[0].id

      await createCollectionDvObjectFeaturedItemViaApi(testFileDeletedCollectionAlias, {
        type: 'datafile',
        dvObjectIdentifier: fileId.toString(),
        displayOrder: 0
      })

      const featuredItemsResponse = await sut.getCollectionFeaturedItems(
        testFileDeletedCollectionAlias
      )

      expect(featuredItemsResponse.length).toBe(1)

      // Now we delete the file
      await deleteFile.execute(fileId)

      // If we dont publish the dataset the featured item will still be there
      const featuredItemsResponseAfterFileDeletion = await sut.getCollectionFeaturedItems(
        testFileDeletedCollectionAlias
      )

      expect(featuredItemsResponseAfterFileDeletion.length).toBe(1)

      // Once we publish the dataset the featured item will not be returned anymore
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const featuredItemsResponseAfterDatasetPublish = await sut.getCollectionFeaturedItems(
        testFileDeletedCollectionAlias
      )

      expect(featuredItemsResponseAfterDatasetPublish.length).toBe(0)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      await deleteCollectionViaApi(testFileDeletedCollectionAlias)
    })

    test('Featured Item type File should not be returned if the file was restricted', async () => {
      const testFileRestrictedCollectionAlias = 'testCollectionFeaturedItemsFileRestriction'
      await createCollectionViaApi(testFileRestrictedCollectionAlias)
      await publishCollectionViaApi(testFileRestrictedCollectionAlias)
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testFileRestrictedCollectionAlias
      )
      await uploadFileViaApi(testDatasetIds.numericId, 'test-file-1.txt')
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)

      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)
      const fileId = datasetFiles.files[0].id

      await createCollectionDvObjectFeaturedItemViaApi(testFileRestrictedCollectionAlias, {
        type: 'datafile',
        dvObjectIdentifier: fileId.toString(),
        displayOrder: 0
      })

      const featuredItemsResponse = await sut.getCollectionFeaturedItems(
        testFileRestrictedCollectionAlias
      )

      expect(featuredItemsResponse.length).toBe(1)

      // Now we restrict the file
      await restrictFile.execute(fileId, {
        restrict: true,
        enableAccessRequest: true,
        termsOfAccess: 'This file is restricted for testing purposes'
      })

      // Restricted file should not be returned as featured item once restricted
      const featuredItemsResponseAfterFileRestriction = await sut.getCollectionFeaturedItems(
        testFileRestrictedCollectionAlias
      )

      expect(featuredItemsResponseAfterFileRestriction.length).toBe(0)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
      await deleteCollectionViaApi(testFileRestrictedCollectionAlias)
    })
  })

  describe('updateCollectionFeaturedItems', () => {
    afterAll(async () => {
      try {
        await deleteCollectionFeaturedItemsViaApi(testCollectionAlias)
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while deleting all featured items from collection: ${testCollectionAlias}`
        )
      }
    })

    it('should update collection featured items sending all new items', async () => {
      const newFeaturedItems: FeaturedItemsDTO = [
        {
          type: FeaturedItemType.CUSTOM,
          content: '<p class="rte-paragraph">Test content 1</p>',
          displayOrder: 0,
          file: undefined,
          keepFile: false
        },
        {
          type: FeaturedItemType.CUSTOM,
          content: '<p class="rte-paragraph">Test content 2</p>',
          displayOrder: 1,
          file: undefined,
          keepFile: false
        },
        {
          type: FeaturedItemType.CUSTOM,
          content: '<p class="rte-paragraph">Test content 3</p>',
          displayOrder: 2,
          file: createImageFile('featured-item-test-image-3.png'),
          keepFile: false
        }
      ]

      const response = await sut.updateCollectionFeaturedItems(
        testCollectionAlias,
        newFeaturedItems
      )

      expect(response).toHaveLength(3)

      const firstFeaturedItem = response[0] as CustomFeaturedItem
      const secondFeaturedItem = response[1] as CustomFeaturedItem
      const thirdFeaturedItem = response[2] as CustomFeaturedItem

      expect(firstFeaturedItem.content).toEqual((newFeaturedItems[0] as CustomFeaturedItem).content)
      expect(firstFeaturedItem.displayOrder).toEqual(newFeaturedItems[0].displayOrder)
      expect(firstFeaturedItem.imageFileName).toEqual(undefined)
      expect(firstFeaturedItem.imageFileUrl).toEqual(undefined)

      expect(secondFeaturedItem.content).toEqual(
        (newFeaturedItems[1] as CustomFeaturedItem).content
      )
      expect(secondFeaturedItem.displayOrder).toEqual(newFeaturedItems[1].displayOrder)
      expect(secondFeaturedItem.imageFileName).toEqual(undefined)
      expect(secondFeaturedItem.imageFileUrl).toEqual(undefined)

      expect(thirdFeaturedItem.content).toEqual((newFeaturedItems[2] as CustomFeaturedItem).content)
      expect(thirdFeaturedItem.displayOrder).toEqual(newFeaturedItems[2].displayOrder)
      expect(thirdFeaturedItem.imageFileName).toEqual('featured-item-test-image-3.png')
      expect(thirdFeaturedItem.imageFileUrl).toContain(
        `/api/access/dataverseFeaturedItemImage/${response[2].id}`
      )
    })

    it('should return error when the dvObjectIdentifier of a collection does not exist', async () => {
      const invalidCollectionAlias = 'invalid-collection-alias'
      const newFeaturedItems: DvObjectFeaturedItemDTO[] = [
        {
          type: FeaturedItemType.COLLECTION,
          dvObjectIdentifier: invalidCollectionAlias,
          displayOrder: 0
        }
      ]

      const expectedError = new WriteError(
        `[400] Cant find Collection, Dataset, or Datafile with identifier: ${invalidCollectionAlias}.`
      )
      await expect(
        sut.updateCollectionFeaturedItems(testCollectionAlias, newFeaturedItems)
      ).rejects.toThrow(expectedError)
    })

    it('should return error when the dvObjectIdentifier of a dataset does not exist', async () => {
      const invalidDatasetPersistentId = 'doi:10.5072/FK2/INVALID_DATASET'
      const newFeaturedItems: DvObjectFeaturedItemDTO[] = [
        {
          type: FeaturedItemType.DATASET,
          dvObjectIdentifier: invalidDatasetPersistentId,
          displayOrder: 0
        }
      ]
      const expectedError = new WriteError(
        `[400] Cant find Collection, Dataset, or Datafile with identifier: ${invalidDatasetPersistentId}.`
      )
      await expect(
        sut.updateCollectionFeaturedItems(testCollectionAlias, newFeaturedItems)
      ).rejects.toThrow(expectedError)
    })

    it('should return error when the dvObjectIdentifier of a file does not exist', async () => {
      const invalidFileId = '99'
      const newFeaturedItems: DvObjectFeaturedItemDTO[] = [
        {
          type: FeaturedItemType.FILE,
          dvObjectIdentifier: invalidFileId,
          displayOrder: 0
        }
      ]
      const expectedError = new WriteError(
        `[400] Cant find Collection, Dataset, or Datafile with identifier: ${invalidFileId}.`
      )
      await expect(
        sut.updateCollectionFeaturedItems(testCollectionAlias, newFeaturedItems)
      ).rejects.toThrow(expectedError)
    })

    it('should return error when the collection to feature is not published', async () => {
      const unpublishedCollectionAlias = 'unpublished-collection-featured-item-test'
      await createCollectionViaApi(unpublishedCollectionAlias, testCollectionAlias)

      const newFeaturedItems: DvObjectFeaturedItemDTO[] = [
        {
          type: FeaturedItemType.COLLECTION,
          dvObjectIdentifier: unpublishedCollectionAlias,
          displayOrder: 0
        }
      ]
      const expectedError = new WriteError('[400] Dataverse must be published to be featured.')
      await expect(
        sut.updateCollectionFeaturedItems(testCollectionAlias, newFeaturedItems)
      ).rejects.toThrow(expectedError)
      await deleteCollectionViaApi(unpublishedCollectionAlias)
    })

    it('should return error when the dataset to feature is not published', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )

      const newFeaturedItems: DvObjectFeaturedItemDTO[] = [
        {
          type: FeaturedItemType.DATASET,
          dvObjectIdentifier: testDatasetIds.persistentId,
          displayOrder: 0
        }
      ]
      const expectedError = new WriteError('[400] Dataset must be published to be featured.')
      await expect(
        sut.updateCollectionFeaturedItems(testCollectionAlias, newFeaturedItems)
      ).rejects.toThrow(expectedError)

      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    })

    it('should return error when the file to feature is not published', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
      await uploadFileViaApi(testDatasetIds.numericId, 'test-file-1.txt')

      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)

      const fileId = datasetFiles.files[0].id

      const newFeaturedItems: DvObjectFeaturedItemDTO[] = [
        {
          type: FeaturedItemType.FILE,
          dvObjectIdentifier: fileId.toString(),
          displayOrder: 0
        }
      ]

      const expectedError = new WriteError('[400] Dataset must be published to be featured.')

      await expect(
        sut.updateCollectionFeaturedItems(testCollectionAlias, newFeaturedItems)
      ).rejects.toThrow(expectedError)

      await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
    })

    it('should return error when the file to feature is restricted', async () => {
      const testDatasetIds = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        testCollectionAlias
      )
      await publishDatasetViaApi(testDatasetIds.numericId)
      await waitForNoLocks(testDatasetIds.numericId, 10)
      await uploadFileViaApi(testDatasetIds.numericId, 'test-file-1.txt')

      const datasetFiles = await getDatasetFiles.execute(testDatasetIds.numericId)

      const fileId = datasetFiles.files[0].id

      await restrictFile.execute(fileId, {
        restrict: true,
        enableAccessRequest: true,
        termsOfAccess: 'This file is restricted for testing purposes'
      })

      const newFeaturedItems: DvObjectFeaturedItemDTO[] = [
        {
          type: FeaturedItemType.FILE,
          dvObjectIdentifier: fileId.toString(),
          displayOrder: 0
        }
      ]

      const expectedError = new WriteError('[400] Datafile must not be restricted to be featured.')

      await expect(
        sut.updateCollectionFeaturedItems(testCollectionAlias, newFeaturedItems)
      ).rejects.toThrow(expectedError)

      await deletePublishedDatasetViaApi(testDatasetIds.persistentId)
    })
  })

  describe('deleteCollectionFeaturedItems', () => {
    beforeAll(async () => {
      try {
        await createCollectionCustomFeaturedItemViaApi(testCollectionAlias, {
          content: '<p class="rte-paragraph">Test content</p>',
          displayOrder: 1,
          withFile: true,
          fileName: 'featured-item-test-image.png'
        })
        await createCollectionCustomFeaturedItemViaApi(testCollectionAlias, {
          content: '<p class="rte-paragraph">Test content 2</p>',
          displayOrder: 2,
          withFile: false
        })
        await createCollectionCustomFeaturedItemViaApi(testCollectionAlias, {
          content: '<p class="rte-paragraph">Test content 3</p>',
          displayOrder: 3,
          withFile: false
        })
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while creating test featured items for collection: ${testCollectionAlias}`
        )
      }
    })

    afterAll(async () => {
      try {
        await deleteCollectionFeaturedItemsViaApi(testCollectionAlias)
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while deleting test collection featured items: ${testCollectionAlias}`
        )
      }
    })

    it('should delete all collection featured items', async () => {
      const featuredItemsResponseBeforeDeletion = await sut.getCollectionFeaturedItems(
        testCollectionAlias
      )

      expect(featuredItemsResponseBeforeDeletion).toHaveLength(3)

      await sut.deleteCollectionFeaturedItems(testCollectionAlias)

      const featuredItemsResponseAfterDeletion = await sut.getCollectionFeaturedItems(
        testCollectionAlias
      )

      expect(featuredItemsResponseAfterDeletion).toStrictEqual([])
    })
  })

  describe('deleteCollectionFeaturedItem', () => {
    let featuredItemTestId: number

    beforeAll(async () => {
      try {
        const featuredItem = await createCollectionCustomFeaturedItemViaApi(testCollectionAlias, {
          content: '<p class="rte-paragraph">Test content</p>',
          displayOrder: 1,
          withFile: true,
          fileName: 'featured-item-test-image.png'
        })
        featuredItemTestId = featuredItem.id
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while creating test featured items for collection: ${testCollectionAlias}`
        )
      }
    })

    it('should delete a collection featured item', async () => {
      const featuredItemsResponseBeforeDeletion = await sut.getCollectionFeaturedItems(
        testCollectionAlias
      )

      expect(featuredItemsResponseBeforeDeletion).toHaveLength(1)

      await sut.deleteCollectionFeaturedItem(featuredItemTestId)

      const featuredItemsResponseAfterDeletion = await sut.getCollectionFeaturedItems(
        testCollectionAlias
      )

      expect(featuredItemsResponseAfterDeletion).toStrictEqual([])
    })
  })

  describe('getMyDataCollectionItems', () => {
    let testDatasetIds: CreatedDatasetIdentifiers

    const testTextFile1Name = 'test-file-2.txt'
    const testSubCollectionAlias = 'collectionsRepositoryMyDataCollection'
    const testCollectionName = 'Scientific Research'
    beforeAll(async () => {
      const createSuperUser = true
      const myDataUserApiToken = await createApiTokenViaApi('myDataUser', createSuperUser)
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        myDataUserApiToken
      )
      process.env.TEST_API_KEY = myDataUserApiToken
      const collectionDTO = createCollectionDTO(testSubCollectionAlias)
      // Calling the  createCollection use case here
      // because createCollectionViaApi does not create the collection in a way
      // that is recognized by then MyData endpoint
      await createCollection.execute(collectionDTO, testCollectionAlias).catch((error) => {
        console.log(error.message)
        throw new Error(
          `Tests beforeAll(): Error while creating subcollection ${testSubCollectionAlias}`
        )
      })
      try {
        testDatasetIds = await createDataset.execute(
          TestConstants.TEST_NEW_DATASET_DTO,
          testSubCollectionAlias
        )
      } catch {
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
        throw new Error(
          `Tests afterAll(): Error while deleting test dataset ${testDatasetIds.numericId}`
        )
      }
      try {
        await deleteCollectionViaApi(testSubCollectionAlias)
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while deleting subcollection ${testSubCollectionAlias}`
        )
      }
    })
    test('should return collection items given valid roleIds', async () => {
      // Give enough time to Solr for indexing
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await getCollection.execute(testSubCollectionAlias).then((collection) => {
        expect(collection).toBeDefined()
        expect(collection.name).toBe('Test Collection')
        expect(collection.alias).toBe(testSubCollectionAlias)
        expect(collection.description).toBe('test description')
        expect(collection.affiliation).toBe('test affiliation')
      })
      // TODO: replace this with API call to get the role ids
      const roleIds = [1, 2, 3, 4, 5, 6, 7, 8]
      const publicationStatuses = [PublicationStatus.Draft, PublicationStatus.Unpublished]
      const collectionItemTypes = [
        CollectionItemType.COLLECTION,
        CollectionItemType.DATASET,
        CollectionItemType.FILE
      ]
      let actual = await sut.getMyDataCollectionItems(
        roleIds,
        collectionItemTypes,
        publicationStatuses
      )
      const actualFilePreview = actual.items.find(
        (item) => item.type === CollectionItemType.FILE
      ) as FilePreview
      const actualDatasetPreview = actual.items.find(
        (item) => item.type === CollectionItemType.DATASET
      ) as DatasetPreview
      const actualCollectionPreview = actual.items.find(
        (item) => item.type === CollectionItemType.COLLECTION
      ) as CollectionPreview

      const expectedFileMd5 = '799b5c8c5fdcfbd56c3943f7a6c35326'
      const expectedDatasetCitationFragment = `Admin, Dataverse; Owner, Dataverse, ${currentYear}, "Dataset created using the createDataset use case"`
      const expectedDatasetDescription = 'Dataset created using the createDataset use case'
      const expectedFileName = 'test-file-2.txt'
      const expectedCollectionsName = 'Test Collection'

      const expectedPublicationStatusCounts = [
        { publicationStatus: 'Published', count: 0 },
        { publicationStatus: 'Unpublished', count: 3 },
        { publicationStatus: 'Draft', count: 2 },
        { publicationStatus: 'In Review', count: 0 },
        { publicationStatus: 'Deaccessioned', count: 0 }
      ]

      expect(actual.items.length).toBe(3)
      expect(actual.totalItemCount).toBe(3)
      expect(actual.countPerObjectType.collections).toBe(1)
      expect(actual.countPerObjectType.datasets).toBe(1)
      expect(actual.countPerObjectType.files).toBe(1)

      expect(actualFilePreview.checksum?.type).toBe('MD5')
      expect(actualFilePreview.checksum?.value).toBeDefined()
      expect(actualFilePreview.datasetCitation).toContain(expectedDatasetCitationFragment)
      expect(actualFilePreview.datasetId).toBe(testDatasetIds.numericId)
      expect(actualFilePreview.datasetName).toBe(expectedDatasetDescription)
      expect(actualFilePreview.datasetPersistentId).toBe(testDatasetIds.persistentId)
      expect(actualFilePreview.description).toBe('')
      expect(actualFilePreview.fileContentType).toBe('text/plain')
      expect(actualFilePreview.fileId).not.toBeUndefined()
      expect(actualFilePreview.fileType).toBe('Plain Text')
      expect(actualFilePreview.md5).toBe(expectedFileMd5)
      expect(actualFilePreview.name).toBe(expectedFileName)
      expect(actualFilePreview.publicationStatuses).toContain(PublicationStatus.Unpublished)
      expect(actualFilePreview.publicationStatuses).toContain(PublicationStatus.Draft)
      expect(actualFilePreview.sizeInBytes).toBe(12)
      expect(actualFilePreview.url).not.toBeUndefined()
      expect(actualFilePreview.releaseOrCreateDate).not.toBeUndefined()
      expect(actualFilePreview.type).toBe(CollectionItemType.FILE)
      expect(actualFilePreview.restricted).toBe(false)
      expect(actualFilePreview.canDownloadFile).toBe(true)

      expect(actualDatasetPreview.title).toBe(expectedDatasetDescription)
      expect(actualDatasetPreview.citation).toContain(expectedDatasetCitationFragment)
      expect(actualDatasetPreview.description).toBe('This is the description of the dataset.')
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.persistentId).not.toBeUndefined()
      expect(actualDatasetPreview.publicationStatuses).toContain(PublicationStatus.Unpublished)
      expect(actualDatasetPreview.publicationStatuses).toContain(PublicationStatus.Draft)
      expect(actualDatasetPreview.versionId).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.createTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.lastUpdateTime).not.toBeUndefined()
      expect(actualDatasetPreview.versionInfo.majorNumber).toBeUndefined()
      expect(actualDatasetPreview.versionInfo.minorNumber).toBeUndefined()
      expect(actualDatasetPreview.versionInfo.state).toBe('DRAFT')
      expect(actualDatasetPreview.parentCollectionAlias).toBe(
        'collectionsRepositoryMyDataCollection'
      )
      expect(actualDatasetPreview.parentCollectionName).toBe(expectedCollectionsName)
      expect(actualDatasetPreview.type).toBe(CollectionItemType.DATASET)

      expect(actualCollectionPreview.name).toBe(expectedCollectionsName)
      expect(actualCollectionPreview.alias).toBe(testSubCollectionAlias)
      expect(actualCollectionPreview.description).toBe('test description')
      expect(actualCollectionPreview.imageUrl).toBe(undefined)
      expect(actualCollectionPreview.parentAlias).toBe(testCollectionAlias)
      expect(actualCollectionPreview.parentName).toBe(testCollectionName)
      expect(actualCollectionPreview.publicationStatuses).toContain(PublicationStatus.Unpublished)
      expect(actualCollectionPreview.releaseOrCreateDate).not.toBeUndefined()
      expect(actualCollectionPreview.affiliation).toBe('test affiliation')
      expect(actualCollectionPreview.type).toBe(CollectionItemType.COLLECTION)

      expect(actual.publicationStatusCounts).toEqual(expectedPublicationStatusCounts)

      // Test limit and selectedPage
      actual = await sut.getMyDataCollectionItems(
        roleIds,
        collectionItemTypes,
        publicationStatuses,
        1,
        1
      )
      expect((actual.items[1] as FilePreview).name).toBe(expectedFileName)
      expect(actual.items.length).toBe(3)
      expect(actual.totalItemCount).toBe(3)

      // Test search text
      const fileNameSearchText = 'file-2'

      const actualFileResult = await sut.getMyDataCollectionItems(
        roleIds,
        collectionItemTypes,
        publicationStatuses,
        undefined,
        undefined,
        fileNameSearchText
      )
      expect(actualFileResult.totalItemCount).toBe(1)
      expect((actualFileResult.items[0] as FilePreview).name).toBe(expectedFileName)
      expect(actualFileResult.countPerObjectType.collections).toBe(0)
      expect(actualFileResult.countPerObjectType.datasets).toBe(0)
      expect(actualFileResult.countPerObjectType.files).toBe(1)

      const datasetSearchText = 'of the dataset.'

      actual = await sut.getMyDataCollectionItems(
        roleIds,
        collectionItemTypes,
        publicationStatuses,
        undefined,
        undefined,
        datasetSearchText
      )

      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as DatasetPreview).title).toBe(expectedDatasetDescription)
      expect(actual.countPerObjectType.collections).toBe(0)
      expect(actual.countPerObjectType.datasets).toBe(1)
      expect(actual.countPerObjectType.files).toBe(0)

      // Test search text, limit and offset
      // TODO: run this test when the limit param has been fixed in the Dataverse API
      /*
      actual = await sut.getMyDataCollectionItems(
        roleIds,
        collectionItemTypes,
        publicationStatuses,
        1,
        1,
        searchTextForDatasetAndCollection
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(2)
      expect((actual.items[0] as CollectionPreview).name).toBe(expectedCollectionsName)
      expect(actual.countPerObjectType.collections).toBe(1)
      expect(actual.countPerObjectType.datasets).toBe(1)
      expect(actual.countPerObjectType.files).toBe(0)
      */

      // Test type collection
      const searchForCollectionType = [CollectionItemType.COLLECTION]
      actual = await sut.getMyDataCollectionItems(
        roleIds,
        searchForCollectionType,
        publicationStatuses,
        undefined,
        undefined
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as CollectionPreview).name).toBe(expectedCollectionsName)
      expect(actual.publicationStatusCounts).toEqual([
        { publicationStatus: 'Published', count: 0 },
        { publicationStatus: 'Unpublished', count: 1 },
        { publicationStatus: 'Draft', count: 0 },
        { publicationStatus: 'In Review', count: 0 },
        { publicationStatus: 'Deaccessioned', count: 0 }
      ])
      expect(actual.countPerObjectType.collections).toBe(1)
      expect(actual.countPerObjectType.datasets).toBe(0)
      expect(actual.countPerObjectType.files).toBe(0)

      // Test type dataset
      const searchDatasetType = [CollectionItemType.DATASET]
      actual = await sut.getMyDataCollectionItems(
        roleIds,
        searchDatasetType,
        publicationStatuses,
        undefined,
        undefined
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as DatasetPreview).title).toBe(expectedDatasetDescription)
      expect(actual.publicationStatusCounts).toEqual([
        { publicationStatus: 'Published', count: 0 },
        { publicationStatus: 'Unpublished', count: 1 },
        { publicationStatus: 'Draft', count: 1 },
        { publicationStatus: 'In Review', count: 0 },
        { publicationStatus: 'Deaccessioned', count: 0 }
      ])
      expect(actual.countPerObjectType.collections).toBe(0)
      expect(actual.countPerObjectType.datasets).toBe(1)
      expect(actual.countPerObjectType.files).toBe(0)

      // Test type file
      const searchFileType = [CollectionItemType.FILE]

      actual = await sut.getMyDataCollectionItems(
        roleIds,
        searchFileType,
        publicationStatuses,
        undefined,
        undefined
      )
      expect(actual.items.length).toBe(1)
      expect(actual.totalItemCount).toBe(1)
      expect((actual.items[0] as FilePreview).name).toBe(expectedFileName)
      expect(actual.publicationStatusCounts).toEqual([
        { publicationStatus: 'Published', count: 0 },
        { publicationStatus: 'Unpublished', count: 1 },
        { publicationStatus: 'Draft', count: 1 },
        { publicationStatus: 'In Review', count: 0 },
        { publicationStatus: 'Deaccessioned', count: 0 }
      ])

      expect(actual.countPerObjectType.collections).toBe(0)
      expect(actual.countPerObjectType.datasets).toBe(0)
      expect(actual.countPerObjectType.files).toBe(1)

      // Test multiple types
      const searchForMultiTypes = [CollectionItemType.FILE, CollectionItemType.COLLECTION]
      actual = await sut.getMyDataCollectionItems(
        roleIds,
        searchForMultiTypes,
        publicationStatuses,
        undefined,
        undefined
      )
      expect(actual.items.length).toBe(2)
      expect(actual.totalItemCount).toBe(2)
      expect((actual.items[0] as FilePreview).name).toBe(expectedFileName)
      expect((actual.items[1] as CollectionPreview).name).toBe(expectedCollectionsName)
      expect(actual.countPerObjectType.collections).toBe(1)
      expect(actual.countPerObjectType.datasets).toBe(0)
      expect(actual.countPerObjectType.files).toBe(1)
    })

    test('should return error when role, type and publication status params are empty', async () => {
      const expectedError = new ReadError('No results. Please select at least one Role.')

      await expect(
        sut.getMyDataCollectionItems([], [], [], 0, 0, undefined, undefined)
      ).rejects.toThrow(expectedError)
    })
  })
  describe('linkCollection', () => {
    const firstCollectionAlias = 'linkCollectionFirst'
    const secondCollectionAlias = 'linkCollectionSecond'

    beforeAll(async () => {
      await createCollectionViaApi(firstCollectionAlias)
      await createCollectionViaApi(secondCollectionAlias)
    })

    afterAll(async () => {
      await deleteCollectionViaApi(firstCollectionAlias)
      await deleteCollectionViaApi(secondCollectionAlias)
    })

    test('should link a collection successfully', async () => {
      const firstCollection = await sut.getCollection(firstCollectionAlias)
      await sut.getCollection(secondCollectionAlias)

      await sut.linkCollection(secondCollectionAlias, firstCollectionAlias)

      await sut.getCollection(secondCollectionAlias)
      await new Promise((res) => setTimeout(res, 2000))
      const collectionItemSubset = await sut.getCollectionItems(firstCollection.alias)
      expect(collectionItemSubset.items.length).toBe(1)
    })

    test('should throw error when linking a non-existent collection', async () => {
      const invalidCollectionId = 99999
      const firstCollection = await sut.getCollection(firstCollectionAlias)

      const expectedError = new WriteError("[404] Can't find dataverse with identifier='99999'")

      await expect(sut.linkCollection(invalidCollectionId, firstCollection.id)).rejects.toThrow(
        expectedError
      )
    })
  })

  describe('unlinkCollection', () => {
    const firstCollectionAlias = 'unlinkCollectionFirst'
    const secondCollectionAlias = 'unlinkCollectionSecond'

    beforeAll(async () => {
      await createCollectionViaApi(firstCollectionAlias)
      await createCollectionViaApi(secondCollectionAlias)

      const firstCollection = await sut.getCollection(firstCollectionAlias)
      const secondCollection = await sut.getCollection(secondCollectionAlias)

      await sut.linkCollection(secondCollection.id, firstCollection.id)
    })

    afterAll(async () => {
      await deleteCollectionViaApi(firstCollectionAlias)
      await deleteCollectionViaApi(secondCollectionAlias)
    })

    test('should unlink a collection successfully', async () => {
      const firstCollection = await sut.getCollection(firstCollectionAlias)
      const secondCollection = await sut.getCollection(secondCollectionAlias)

      await sut.unlinkCollection(secondCollection.id, firstCollection.id)
      await new Promise((res) => setTimeout(res, 2000))

      await sut.getCollection(secondCollectionAlias)
      const collectionItemSubset = await sut.getCollectionItems(firstCollection.alias)
      expect(collectionItemSubset.items).toStrictEqual([])
    })

    test('should throw error when unlinking a non-existent collection', async () => {
      const invalidCollectionId = 99999
      const firstCollection = await sut.getCollection(firstCollectionAlias)

      const expectedError = new WriteError("[404] Can't find dataverse with identifier='99999'")

      await expect(sut.unlinkCollection(invalidCollectionId, firstCollection.id)).rejects.toThrow(
        expectedError
      )
    })
  })
  describe('getCollectionLinks', () => {
    const firstCollectionAlias = 'getCollectionLinksFirst'
    const secondCollectionAlias = 'getCollectionLinksSecond'
    const thirdCollectionAlias = 'getCollectionLinksThird'
    const fourthCollectionAlias = 'getCollectionLinksFourth'
    let childDatasetNumericId: number
    beforeAll(async () => {
      await createCollectionViaApi(firstCollectionAlias)
      await createCollectionViaApi(secondCollectionAlias)
      await createCollectionViaApi(thirdCollectionAlias)
      await createCollectionViaApi(fourthCollectionAlias)
      const { numericId: createdId } = await createDataset.execute(
        TestConstants.TEST_NEW_DATASET_DTO,
        fourthCollectionAlias
      )
      childDatasetNumericId = createdId
      await sut.linkCollection(secondCollectionAlias, firstCollectionAlias)
      await sut.linkCollection(firstCollectionAlias, thirdCollectionAlias)
      await sut.linkCollection(firstCollectionAlias, fourthCollectionAlias)
      await linkDataset.execute(childDatasetNumericId, firstCollectionAlias)
    })

    afterAll(async () => {
      await deleteUnpublishedDatasetViaApi(childDatasetNumericId)
      await deleteCollectionViaApi(firstCollectionAlias)
      await deleteCollectionViaApi(secondCollectionAlias)
      await deleteCollectionViaApi(thirdCollectionAlias)
      await deleteCollectionViaApi(fourthCollectionAlias)
    })

    test('should return collection links successfully', async () => {
      const firstCollection = await sut.getCollection(firstCollectionAlias)
      const collectionLinks = await sut.getCollectionLinks(firstCollection.id)

      expect(collectionLinks.linkedCollections).toHaveLength(1)

      expect(collectionLinks.linkedCollections[0].alias).toBe(secondCollectionAlias)
      expect(collectionLinks.collectionsLinkingToThis).toHaveLength(2)
      expect(collectionLinks.collectionsLinkingToThis[0].alias).toBe(thirdCollectionAlias)
      expect(collectionLinks.collectionsLinkingToThis[1].alias).toBe(fourthCollectionAlias)
      expect(collectionLinks.linkedDatasets).toHaveLength(1)
      expect(collectionLinks.linkedDatasets[0].title).toBe(
        'Dataset created using the createDataset use case'
      )
    })

    test('should return error when collection does not exist', async () => {
      const invalidCollectionId = 99999
      const expectedError = new ReadError("[404] Can't find dataverse with identifier='99999'")

      await expect(sut.getCollectionLinks(invalidCollectionId)).rejects.toThrow(expectedError)
    })
  })
})
