import {
  ApiConfig,
  WriteError,
  createCollection,
  getCollection,
  updateCollection,
  CollectionDTO
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

  test('should successfully update a new collection', async () => {
    const testNewCollectionAlias = 'updateCollection-functional-test'
    const testNewCollection = createCollectionDTO(testNewCollectionAlias)
    await createCollection.execute(testNewCollection)
    const testNewName = 'Updated Name'
    testNewCollection.name = testNewName
    expect.assertions(1)
    try {
      await updateCollection.execute(testNewCollectionAlias, testNewCollection)
    } catch (error) {
      throw new Error('Collection should be updated')
    } finally {
      const updatedCollection = await getCollection.execute(testNewCollectionAlias)
      expect(updatedCollection.name).toBe(testNewName)
    }
  })

  test('should successfully update a collection with partial data (name only)', async () => {
    const testNewCollectionAlias = 'updateCollection-partial-test'
    const testNewCollection = createCollectionDTO(testNewCollectionAlias)
    await createCollection.execute(testNewCollection)

    const partialUpdate: Partial<CollectionDTO> = {
      name: 'Partially Updated Name'
    }

    expect.assertions(3)
    try {
      await updateCollection.execute(testNewCollectionAlias, partialUpdate)
    } catch (error) {
      throw new Error('Collection should be updated with partial data')
    } finally {
      const updatedCollection = await getCollection.execute(testNewCollectionAlias)
      expect(updatedCollection.name).toBe('Partially Updated Name')
      expect(updatedCollection.alias).toBe(testNewCollectionAlias)
      expect(updatedCollection.type).toBe(testNewCollection.type)
    }
  })

  test('should throw an error when the parent collection does not exist', async () => {
    const testNewCollection = createCollectionDTO()
    expect.assertions(2)
    let writeError: WriteError | undefined = undefined
    try {
      await updateCollection.execute(TestConstants.TEST_DUMMY_COLLECTION_ID, testNewCollection)
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
