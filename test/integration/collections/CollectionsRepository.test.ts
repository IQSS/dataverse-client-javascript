import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError, WriteError } from '../../../src'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionDTO,
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'

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
})
