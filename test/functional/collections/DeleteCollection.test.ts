import {
  ApiConfig,
  ReadError,
  WriteError,
  createCollection,
  deleteCollection,
  getCollection
} from '../../../src'
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

  test('should successfully delete a collection', async () => {
    const testCollectionAlias = 'deleteCollection-functional-test'
    const testNewCollection = createCollectionDTO(testCollectionAlias)
    await createCollection.execute(testNewCollection)

    expect.assertions(1)
    try {
      await deleteCollection.execute(testCollectionAlias)
    } catch (error) {
      throw new Error('Collection should be deleted')
    } finally {
      const expectedError = new ReadError(
        `[404] Can't find dataverse with identifier='${testCollectionAlias}'`
      )
      await expect(getCollection.execute(testCollectionAlias)).rejects.toThrow(expectedError)
    }
  })

  test('should throw an error when the collection does not exist', async () => {
    expect.assertions(2)
    let writeError: WriteError | undefined = undefined
    try {
      await deleteCollection.execute(TestConstants.TEST_DUMMY_COLLECTION_ID)
      throw new Error('Use case should throw an error')
    } catch (error) {
      writeError = error as WriteError
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect(writeError?.message).toEqual(
        `There was an error when writing the resource. Reason was: [404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
      )
    }
  })
})
