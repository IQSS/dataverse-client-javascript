import { ApiConfig, deleteCollectionFeaturedItem, WriteError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { createCollectionCustomFeaturedItemViaApi } from '../../testHelpers/collections/collectionFeaturedItemsHelper'

describe('execute', () => {
  const testCollectionAlias = 'deleteCollectionFeaturedItemTest'
  let featuredItemTestId: number

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
      const featuredItem = await createCollectionCustomFeaturedItemViaApi(testCollectionAlias, {
        content: '<p class="rte-paragraph">Test content</p>',
        displayOrder: 1,
        withFile: true,
        fileName: 'featured-item-test-image.png'
      })
      featuredItemTestId = featuredItem.id
    } catch (error) {
      throw new Error(
        `Tests beforeAll(): Error while creating test collection: ${testCollectionAlias}`
      )
    }
  })

  afterAll(async () => {
    try {
      await deleteCollectionViaApi(testCollectionAlias)
    } catch (error) {
      throw new Error(
        `Tests afterAll(): Error while deleting test collection: ${testCollectionAlias}`
      )
    }
  })

  test('should succesfully delete the featured item', async () => {
    const actual = await deleteCollectionFeaturedItem.execute(featuredItemTestId)

    expect(actual).toBeUndefined()
  })

  test('should throw an error when featured item does not exist', async () => {
    const invalidFeaturedItemId = 99
    let writeError: WriteError | undefined

    try {
      await deleteCollectionFeaturedItem.execute(invalidFeaturedItemId)
    } catch (error) {
      writeError = error as WriteError
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect((writeError as WriteError).message).toEqual(
        `There was an error when writing the resource. Reason was: [404] Could not find dataverse featured item with identifier ${invalidFeaturedItemId}`
      )
    }
  })
})
