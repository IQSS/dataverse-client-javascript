import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError } from '../../../src'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
// import { Collection } from '../../../src/collections'

describe('CollectionsRepository', () => {
  const fooBarBaz: CollectionsRepository = new CollectionsRepository()
  const nonExistentCollectionId = 'returnNullResuts'

  // const collectionId =
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
    describe('by string id', () => {
      test('should return collection when it exists filtering by id (alias)', async () => {
        const actual = await fooBarBaz.getCollection(TestConstants.TEST_CREATED_COLLECTION_1_ID_STR)
        expect(actual.alias).toBe(TestConstants.TEST_CREATED_COLLECTION_1_ID_STR)
      })

      // Case: Unauthenticated
      // test('should return dataset when it is deaccessioned, includeDeaccessioned param is set, and user is unauthenticated', async () => {
      //   ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, undefined)
      //   const actual = await fooBarBaz.getCollection(TestConstants.TEST_CREATED_DATASET_2_ID)
      //   expect(actual.id).toBe(TestConstants.TEST_CREATED_DATASET_2_ID)
      // })

      // Case: Unpublished
      // test('should return error when collection is XXXX', async () => {
      //   const expectedError = new ReadError(
      //     `[404] Dataset version ${latestVersionId} of dataset ${TestConstants.TEST_CREATED_DATASET_2_ID} not found`
      //   )
      //   await expect(
      //     fooBarBaz.getCollection(TestConstants.TEST_CREATED_DATASET_2_ID, latestVersionId, false)
      //   ).rejects.toThrow(expectedError)
      // })

      // Case: Does not exist
      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${nonExistentCollectionId}'`
        )

        await expect(fooBarBaz.getCollection(nonExistentCollectionId)).rejects.toThrow(
          expectedError
        )
      })
    })
  })
})
