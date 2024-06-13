import { ApiConfig, WriteError, createCollection, getCollection } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { createCollectionDTO } from '../../testHelpers/collections/collectionHelper'

describe('execute', () => {
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should successfully create a new collection', async () => {
    const testNewCollection = createCollectionDTO()
    expect.assertions(1)
    let createdCollectionId = 0
    try {
      createdCollectionId = await createCollection.execute(testNewCollection)
    } catch (error) {
      throw new Error('Collection should be created')
    } finally {
      const createdCollection = await getCollection.execute(createdCollectionId)
      expect(createdCollection.alias).toBe(testNewCollection.alias)
    }
  })

  test('should throw an error when the parent collection does not exist', async () => {
    const testNewCollection = createCollectionDTO()
    expect.assertions(2)
    let writeError: WriteError
    try {
      await createCollection.execute(testNewCollection, TestConstants.TEST_DUMMY_COLLECTION_ID)
      throw new Error('Use case should throw an error')
    } catch (error) {
      writeError = error
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect(writeError.message).toEqual(
        `There was an error when writing the resource. Reason was: [404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
      )
    }
  })
})
