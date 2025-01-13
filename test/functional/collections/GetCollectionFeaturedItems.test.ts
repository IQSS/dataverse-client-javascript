import { ApiConfig, ReadError, getCollectionFeaturedItems } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionFeaturedItemViaApi,
  deleteCollectionFeaturedItemViaApi
} from '../../testHelpers/collections/collectionFeaturedItemsHelper'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { ROOT_COLLECTION_ID } from '../../../src/collections/domain/models/Collection'

describe('execute', () => {
  const testCollectionAlias = 'getCollectionsFeaturedItemsTest'
  let testFeaturedItemId: number

  beforeEach(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  beforeAll(async () => {
    try {
      await createCollectionViaApi(testCollectionAlias)

      const featuredItemCreated = await createCollectionFeaturedItemViaApi(testCollectionAlias, {
        content: '<p class="rte-paragraph">Test content</p>',
        displayOrder: 1,
        withFile: true,
        fileName: 'featured-item-test-image.png'
      })

      testFeaturedItemId = featuredItemCreated.id
    } catch (error) {
      throw new Error(`Error while creating collection featured item in ${testCollectionAlias}`)
    }
  })

  afterAll(async () => {
    try {
      await deleteCollectionFeaturedItemViaApi(testFeaturedItemId)
      await deleteCollectionViaApi(testCollectionAlias)
    } catch (error) {
      throw new Error(
        `Tests afterAll(): Error while deleting featured item with id ${testFeaturedItemId}`
      )
    }
  })

  test('should return featured items array given a valid collection alias that has featured items', async () => {
    const featuredItemsResponse = await getCollectionFeaturedItems.execute(testCollectionAlias)

    expect(featuredItemsResponse.length).toBe(1)
    expect(featuredItemsResponse[0].id).toBe(testFeaturedItemId)
    expect(featuredItemsResponse[0].displayOrder).toBe(1)
    // expect(featuredItemsResponse[0].content).toBe('<p class="rte-paragraph">Test content</p>')
    expect(featuredItemsResponse[0].imageFileUrl).toBe(
      `http://localhost:8080/api/access/dataverseFeatureItemImage/${featuredItemsResponse[0].id}`
    )
    expect(featuredItemsResponse[0].imageFileName).toBe('featured-item-test-image.png')
  })

  it('should return imageFileUrl and imageFileName as undefined when featured item does not have an image', async () => {
    const featuredItemCreated = await createCollectionFeaturedItemViaApi(testCollectionAlias, {
      content: '<p class="rte-paragraph">Test content</p>',
      displayOrder: 2
    })

    const featuredItemsResponse = await getCollectionFeaturedItems.execute(testCollectionAlias)

    expect(featuredItemsResponse.length).toBe(2)
    expect(featuredItemsResponse[1].id).toBe(featuredItemCreated.id)
    expect(featuredItemsResponse[1].displayOrder).toBe(2)
    // expect(featuredItemsResponse[1].content).toBe('<p class="rte-paragraph">Test content</p>')
    expect(featuredItemsResponse[1].imageFileUrl).toBeUndefined()
    expect(featuredItemsResponse[1].imageFileName).toBeUndefined()

    await deleteCollectionFeaturedItemViaApi(featuredItemCreated.id)
  })

  test('should return empty featured items array given a valid collection alias that has no featured items', async () => {
    const featuredItemsResponse = await getCollectionFeaturedItems.execute(ROOT_COLLECTION_ID)

    expect(featuredItemsResponse).toStrictEqual([])
  })

  test('should throw an error when collection does not exist', async () => {
    const invalidCollectionAlias = 'invalid-collection-alias'
    let readError: ReadError | undefined

    try {
      await getCollectionFeaturedItems.execute(invalidCollectionAlias)
    } catch (error) {
      readError = error
    } finally {
      expect(readError).toBeInstanceOf(ReadError)
      expect((readError as ReadError).message).toEqual(
        `There was an error when reading the resource. Reason was: [404] Can't find dataverse with identifier='${invalidCollectionAlias}'`
      )
    }
  })
})
