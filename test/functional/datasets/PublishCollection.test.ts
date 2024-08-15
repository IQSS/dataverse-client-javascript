import { ApiConfig, createCollection, publishCollection, WriteError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionDTO,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'

const testNewCollection = createCollectionDTO('test-publish-collection')

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully publish a collection', async () => {
    const createdCollectiontIdentifier = await createCollection.execute(testNewCollection)

    const response = await publishCollection.execute(createdCollectiontIdentifier)

    expect(response).toBeUndefined()
    await deleteCollectionViaApi(testNewCollection.alias)
  })

  test('should throw an error when trying to publish a collection that does not exist', async () => {
    const nonExistentTestCollectionId = 4567
    const expectedError = new WriteError(
      `[404] Can't find dataverse with identifier='${nonExistentTestCollectionId}'`
    )

    await expect(publishCollection.execute(nonExistentTestCollectionId)).rejects.toThrow(
      expectedError
    )
  })
})
