import { ApiConfig, deleteCollectionFeaturedItems, WriteError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import {
  createCollectionFeaturedItemViaApi,
  deleteCollectionFeaturedItemsViaApi
} from '../../testHelpers/collections/collectionFeaturedItemsHelper'

describe('execute', () => {
  const testCollectionAlias = 'deleteCollectionFeaturedItemsTest'

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
      await createCollectionFeaturedItemViaApi(testCollectionAlias, {
        content: '<p class="rte-paragraph">Test content</p>',
        displayOrder: 1,
        withFile: true,
        fileName: 'featured-item-test-image.png'
      })
      await createCollectionFeaturedItemViaApi(testCollectionAlias, {
        content: '<p class="rte-paragraph">Test content 2</p>',
        displayOrder: 2,
        withFile: false
      })
      await createCollectionFeaturedItemViaApi(testCollectionAlias, {
        content: '<p class="rte-paragraph">Test content 3</p>',
        displayOrder: 3,
        withFile: false
      })
    } catch (error) {
      throw new Error(
        `Tests beforeAll(): Error while creating test collection: ${testCollectionAlias}`
      )
    }
  })

  afterAll(async () => {
    try {
      await deleteCollectionFeaturedItemsViaApi(testCollectionAlias)
      await deleteCollectionViaApi(testCollectionAlias)
    } catch (error) {
      throw new Error(
        `Tests afterAll(): Error while deleting test collection: ${testCollectionAlias}`
      )
    }
  })

  test('should succesfully delete all featured items from a collection', async () => {
    const actual = await deleteCollectionFeaturedItems.execute(testCollectionAlias)

    expect(actual).toBeUndefined()
  })

  test('should throw an error when collection does not exist', async () => {
    const invalidCollectionAlias = 'invalid-collection-alias'
    let writeError: WriteError | undefined

    try {
      await deleteCollectionFeaturedItems.execute(invalidCollectionAlias)
    } catch (error) {
      writeError = error
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect((writeError as WriteError).message).toEqual(
        `There was an error when writing the resource. Reason was: [404] Can't find dataverse with identifier='${invalidCollectionAlias}'`
      )
    }
  })
})
