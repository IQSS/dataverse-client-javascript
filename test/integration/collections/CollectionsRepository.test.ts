import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError } from '../../../src'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('CollectionsRepository', () => {
  const testGetCollection: CollectionsRepository = new CollectionsRepository()
  const nonExistentCollectionAlias = 'returnNullResuts'

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
    describe('by string alias', () => {
      test('should return collection when it exists filtering by id AS (alias)', async () => {
        const actual = await testGetCollection.getCollection(
          TestConstants.TEST_CREATED_COLLECTION_1_ID_STR
        )
        expect(actual.alias).toBe(TestConstants.TEST_CREATED_COLLECTION_1_ID_STR)
      })

      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${nonExistentCollectionAlias}'`
        )

        await expect(testGetCollection.getCollection(nonExistentCollectionAlias)).rejects.toThrow(
          expectedError
        )
      })
    })
  })
})
