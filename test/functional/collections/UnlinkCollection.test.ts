import {
  ApiConfig,
  WriteError,
  createCollection,
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

  let firstCollectionId: number
  let secondCollectionId: number
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    const firstCollectionDTO = createCollectionDTO(firstCollectionAlias)
    const secondCollectionDTO = createCollectionDTO(secondCollectionAlias)
    firstCollectionId = await createCollection.execute(firstCollectionDTO)
    secondCollectionId = await createCollection.execute(secondCollectionDTO)
    await linkCollection.execute(secondCollectionAlias, firstCollectionAlias)
    // Give enough time to Solr for indexing
    await new Promise((resolve) => setTimeout(resolve, 5000))
  })

  afterEach(async () => {
    await Promise.all([
      deleteCollection.execute(firstCollectionId),
      deleteCollection.execute(secondCollectionId)
    ])
  })

  test('should successfully unlink two collections', async () => {
    // Verify that the collections are linked
    const collectionItemSubset = await getCollectionItems.execute(firstCollectionAlias)
    expect(collectionItemSubset.items.length).toBe(1)

    await unlinkCollection.execute(secondCollectionAlias, firstCollectionAlias)
    // Wait for the unlinking to be processed by Solr
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const collectionItemSubset2 = await getCollectionItems.execute(firstCollectionAlias)
    expect(collectionItemSubset2.items.length).toBe(0)
  })

  test('should throw an error when linking a non-existent collection', async () => {
    const invalidCollectionId = 99999

    expect.assertions(2)
    let writeError: WriteError | undefined = undefined
    try {
      await unlinkCollection.execute(invalidCollectionId, firstCollectionId)
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
