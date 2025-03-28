import { ApiConfig } from '../../src'
import { CollectionsRepository } from '../../src/collections/infra/repositories/CollectionsRepository'
import { DataverseApiAuthMechanism } from '../../src/core/infra/repositories/ApiConfig'
import { ROOT_COLLECTION_ALIAS } from '../testHelpers/collections/collectionHelper'
import { TestConstants } from '../testHelpers/TestConstants'

describe('Checks remaining data', () => {
  const sut: CollectionsRepository = new CollectionsRepository()

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  it('root collection info', async () => {
    const collection = await sut.getCollection(ROOT_COLLECTION_ALIAS)

    console.log(JSON.stringify(collection, null, 2))

    expect(1).toBe(1)
  })

  it('root collection items', async () => {
    const items = await sut.getCollectionItems(ROOT_COLLECTION_ALIAS)

    console.log(JSON.stringify(items, null, 2))

    expect(1).toBe(1)
  })
})
