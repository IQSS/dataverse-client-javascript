import { ApiConfig, ReadError, getCollectionFeaturedItems } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionCustomFeaturedItemViaApi,
  createCollectionDvObjectFeaturedItemViaApi,
  deleteCollectionFeaturedItemsViaApi,
  deleteCollectionFeaturedItemViaApi
} from '../../testHelpers/collections/collectionFeaturedItemsHelper'
import {
  createCollectionViaApi,
  publishCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { ROOT_COLLECTION_ID } from '../../../src/collections/domain/models/Collection'
import {
  CustomFeaturedItem,
  DvObjectFeaturedItem,
  FeaturedItemType
} from '../../../src/collections/domain/models/CollectionFeaturedItem'

describe('execute', () => {
  const testCollectionAlias = 'getCollectionsFeaturedItemsTest'
  const featuredCollectionAlias = 'featured-collection-test'
  let testFeaturedItemIds: number[] = []

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

      await createCollectionViaApi(featuredCollectionAlias, testCollectionAlias)

      // Publish the collection to be featured otherwise it cannot be featured
      await publishCollectionViaApi(testCollectionAlias)
      await publishCollectionViaApi(featuredCollectionAlias)

      const featuredItemCreated = await createCollectionCustomFeaturedItemViaApi(
        testCollectionAlias,
        {
          content: '<p class="rte-paragraph">Test content</p>',
          displayOrder: 1,
          withFile: true,
          fileName: 'featured-item-test-image.png'
        }
      )

      const dvObjectFeaturedItemCreated = await createCollectionDvObjectFeaturedItemViaApi(
        testCollectionAlias,
        {
          type: 'dataverse',
          dvObjectIdentifier: featuredCollectionAlias,
          displayOrder: 2
        }
      )
      testFeaturedItemIds = [featuredItemCreated.id, dvObjectFeaturedItemCreated.id]
    } catch (error) {
      console.dir(error)
      throw new Error(`Error while creating collection featured item in ${testCollectionAlias}`)
    }
  })

  afterAll(async () => {
    try {
      await deleteCollectionFeaturedItemsViaApi(testCollectionAlias)
      await deleteCollectionViaApi(featuredCollectionAlias)
      await deleteCollectionViaApi(testCollectionAlias)
    } catch (error) {
      throw new Error(
        `Tests afterAll(): Error while deleting featured item with id ${testFeaturedItemIds}`
      )
    }
  })

  test('should return featured items array given a valid collection alias that has featured items', async () => {
    const featuredItemsResponse = await getCollectionFeaturedItems.execute(testCollectionAlias)

    const featuredItemOne = featuredItemsResponse[0] as CustomFeaturedItem
    const featuredItemTwo = featuredItemsResponse[1] as DvObjectFeaturedItem

    expect(featuredItemsResponse.length).toBe(2)
    expect(featuredItemOne.id).toBe(testFeaturedItemIds[0])
    expect(featuredItemOne.displayOrder).toBe(1)
    expect(featuredItemOne.content).toBe('<p class="rte-paragraph">Test content</p>')
    expect(featuredItemOne.imageFileUrl).toBe(
      `http://localhost:8080/api/access/dataverseFeaturedItemImage/${featuredItemOne.id}`
    )
    expect(featuredItemOne.imageFileName).toBe('featured-item-test-image.png')

    expect(featuredItemTwo.id).toBe(testFeaturedItemIds[1])
    expect(featuredItemTwo.type).toBe(FeaturedItemType.COLLECTION)
    expect(featuredItemTwo.dvObjectIdentifier).toBe(featuredCollectionAlias)
    expect(featuredItemTwo.dvObjectDisplayName).toBe('Scientific Research')
    expect(featuredItemTwo.displayOrder).toBe(2)
  })

  it('should return imageFileUrl and imageFileName as undefined when featured item does not have an image', async () => {
    const featuredItemCreated = await createCollectionCustomFeaturedItemViaApi(
      testCollectionAlias,
      {
        content: '<p class="rte-paragraph">Test content</p>',
        displayOrder: 3
      }
    )

    const featuredItemsResponse = await getCollectionFeaturedItems.execute(testCollectionAlias)

    const featuredItemTwo = featuredItemsResponse[2] as CustomFeaturedItem

    expect(featuredItemsResponse.length).toBe(3)
    expect(featuredItemTwo.id).toBe(featuredItemCreated.id)
    expect(featuredItemTwo.displayOrder).toBe(3)
    expect(featuredItemTwo.content).toBe('<p class="rte-paragraph">Test content</p>')
    expect(featuredItemTwo.imageFileUrl).toBeUndefined()
    expect(featuredItemTwo.imageFileName).toBeUndefined()

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
      readError = error as ReadError
    } finally {
      expect(readError).toBeInstanceOf(ReadError)
      expect((readError as ReadError).message).toEqual(
        `There was an error when reading the resource. Reason was: [404] Can't find dataverse with identifier='${invalidCollectionAlias}'`
      )
    }
  })
})
