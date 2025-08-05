import {
  ApiConfig,
  WriteError,
  createCollection,
  getCollection,
  linkCollection,
  deleteCollection,
  getCollectionItems,
  unlinkCollection
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { createCollectionDTO } from '../../testHelpers/collections/collectionHelper'

describe('execute', () => {
  const firstCollectionAlias = 'unlinkCollection-functional-test-first'
  const secondCollectionAlias = 'unlinkCollection-functional-test-second'

  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    const firstCollection = createCollectionDTO(firstCollectionAlias)
    const secondCollection = createCollectionDTO(secondCollectionAlias)
    await createCollection.execute(firstCollection)
    await createCollection.execute(secondCollection)
    await linkCollection.execute(secondCollection.alias, firstCollection.alias)
  })

  afterEach(async () => {
    await Promise.all([
      getCollection
        .execute(firstCollectionAlias)
        .then((collection) =>
          collection && collection.id ? deleteCollection.execute(collection.id) : null
        ),
      getCollection
        .execute(secondCollectionAlias)
        .then((collection) =>
          collection && collection.id ? deleteCollection.execute(collection.id) : null
        )
    ])
  })

  test('should successfully unlink two collections', async () => {
    const firstCollection = await getCollection.execute(firstCollectionAlias)
    const secondCollection = await getCollection.execute(secondCollectionAlias)
    // Give enough time to Solr for indexing
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const collectionItemSubset = await getCollectionItems.execute(firstCollectionAlias)
    expect(collectionItemSubset.items.length).toBe(1)

    await unlinkCollection.execute(secondCollection.alias, firstCollection.alias)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const collectionItemSubset2 = await getCollectionItems.execute(firstCollectionAlias)
    expect(collectionItemSubset2.items.length).toBe(0)
  })

  test('should throw an error when linking a non-existent collection', async () => {
    const invalidCollectionId = 99999
    const firstCollection = await getCollection.execute(firstCollectionAlias)

    expect.assertions(2)
    let writeError: WriteError | undefined = undefined
    try {
      await unlinkCollection.execute(invalidCollectionId, firstCollection.id)
      throw new Error('Use case should throw an error')
    } catch (error) {
      writeError = error as WriteError
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect(writeError?.message).toEqual(
        `There was an error when writing the resource. Reason was: [404] Can't find dataverse with identifier='${invalidCollectionId}'`
      )
    }
  })
})
