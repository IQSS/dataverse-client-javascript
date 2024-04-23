import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError } from '../../../src'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('CollectionsRepository', () => {
  const testGetCollection: CollectionsRepository = new CollectionsRepository()

  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  afterEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  describe('getCollection', () => {
    describe('by default `root` Id', () => {
      test('should return the root collection of the Dataverse installation if no parameter is passed AS `root`', async () => {
        const actual = await testGetCollection.getCollection()
        expect(actual.alias).toBe(TestConstants.TEST_CREATED_COLLECTION_1_ROOT)
      })

      test('should return isReleased is true for root collection', async () => {
        const actual = await testGetCollection.getCollection()
        expect(actual.alias).toBe(TestConstants.TEST_CREATED_COLLECTION_1_ROOT)
        expect(actual.isReleased).toBe(true)
      })
    })
    describe('by string alias', () => {
      test('should return collection when it exists filtering by id AS (alias)', async () => {
        const actual = await testGetCollection.getCollection(
          TestConstants.TEST_CREATED_COLLECTION_1_ALIAS
        )
        expect(actual.alias).toBe(TestConstants.TEST_CREATED_COLLECTION_1_ALIAS)
      })
      test('should return isReleased is false for unpublished collection', async () => {
        const actual = await testGetCollection.getCollection(
          TestConstants.TEST_CREATED_COLLECTION_1_ALIAS
        )
        expect(actual.alias).toBe(TestConstants.TEST_CREATED_COLLECTION_1_ALIAS)
        expect(actual.isReleased).toBe(false)
      })
      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ALIAS}'`
        )

        await expect(
          testGetCollection.getCollection(TestConstants.TEST_DUMMY_COLLECTION_ALIAS)
        ).rejects.toThrow(expectedError)
      })
    })
    describe('by numeric id', () => {
      test('should return collection when it exists filtering by id AS (id)', async () => {
        const actual = await testGetCollection.getCollection(
          TestConstants.TEST_CREATED_COLLECTION_1_ID
        )
        expect(actual.id).toBe(TestConstants.TEST_CREATED_COLLECTION_1_ID)
      })

      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
        )

        await expect(
          testGetCollection.getCollection(TestConstants.TEST_DUMMY_COLLECTION_ID)
        ).rejects.toThrow(expectedError)
      })
    })
  })
})
