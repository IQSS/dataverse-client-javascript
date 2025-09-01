import {
  ApiConfig,
  WriteError,
  createCollection,
  getCollection,
  linkCollection,
  deleteCollection,
  getCollectionItems
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { createCollectionDTO } from '../../testHelpers/collections/collectionHelper'

describe('execute', () => {
  const firstCollectionAlias = 'linkCollection-functional-test-first'
  const secondCollectionAlias = 'linkCollection-functional-test-second'
  let firstCollectionId: number
  let secondCollectionId: number
  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    const firstCollection = createCollectionDTO(firstCollectionAlias)
    const secondCollection = createCollectionDTO(secondCollectionAlias)
    firstCollectionId = await createCollection.execute(firstCollection)
    secondCollectionId = await createCollection.execute(secondCollection)
  })

  afterEach(async () => {
    await Promise.all([
      deleteCollection.execute(firstCollectionId),
      deleteCollection.execute(secondCollectionId)
    ])
  })

  test('should successfully link two collections', async () => {
    expect.assertions(1)
    try {
      await linkCollection.execute(secondCollectionAlias, firstCollectionAlias)
    } catch (error) {
      throw new Error('Collections should be linked successfully')
    } finally {
      // Wait for the linking to be processed by Solr
      await new Promise((resolve) => setTimeout(resolve, 5000))
      const collectionItemSubset = await getCollectionItems.execute(firstCollectionAlias)

      expect(collectionItemSubset.items.length).toBe(1)
    }
  })

  test('should throw an error when linking a non-existent collection', async () => {
    const invalidCollectionId = 99999
    const firstCollection = await getCollection.execute(firstCollectionAlias)

    expect.assertions(2)
    let writeError: WriteError | undefined = undefined
    try {
      await linkCollection.execute(invalidCollectionId, firstCollection.id)
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
