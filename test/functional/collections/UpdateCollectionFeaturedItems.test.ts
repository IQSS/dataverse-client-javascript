import {
  ApiConfig,
  CollectionFeaturedItemsDTO,
  updateCollectionFeaturedItems,
  WriteError
} from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionFeaturedItemViaApi,
  createImageFile,
  deleteCollectionFeaturedItemViaApi
} from '../../testHelpers/collections/collectionFeaturedItemsHelper'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'

//TODO:ME - After content sanitization is fixed in backend, check if the content is being updated correctly keeping classes, href, rel, target, etc attributes.

describe('execute', () => {
  const testCollectionAlias = 'collectionsRepositoryTestCollection'

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

  it('should successfully update the featured items of a collection', async () => {
    const newFeaturedItems: CollectionFeaturedItemsDTO = [
      {
        content: '<p class="rte-paragraph">Test content 1</p>',
        displayOrder: 0,
        file: undefined,
        keepFile: false
      },
      {
        content: '<p class="rte-paragraph">Test content 2</p>',
        displayOrder: 1,
        file: undefined,
        keepFile: false
      },
      {
        content: '<p class="rte-paragraph">Test content 3</p>',
        displayOrder: 2,
        file: createImageFile('featured-item-test-image-3.png'),
        keepFile: false
      }
    ]

    const updatedFeaturedItemsResponse = await updateCollectionFeaturedItems.execute(
      testCollectionAlias,
      newFeaturedItems
    )

    expect(updatedFeaturedItemsResponse.length).toBe(3)

    // expect(updatedFeaturedItemsResponse[0].content).toBe(newFeaturedItems[0].content)
    expect(updatedFeaturedItemsResponse[0].displayOrder).toBe(newFeaturedItems[0].displayOrder)
    expect(updatedFeaturedItemsResponse[0].imageFileUrl).toBeUndefined()
    expect(updatedFeaturedItemsResponse[0].imageFileName).toBeUndefined()

    // expect(updatedFeaturedItemsResponse[1].content).toBe(newFeaturedItems[1].content)
    expect(updatedFeaturedItemsResponse[1].displayOrder).toBe(newFeaturedItems[1].displayOrder)
    expect(updatedFeaturedItemsResponse[1].imageFileUrl).toBeUndefined()
    expect(updatedFeaturedItemsResponse[1].imageFileName).toBeUndefined()

    // expect(updatedFeaturedItemsResponse[2].content).toBe(newFeaturedItems[2].content)
    expect(updatedFeaturedItemsResponse[2].displayOrder).toBe(newFeaturedItems[2].displayOrder)
    expect(updatedFeaturedItemsResponse[2].imageFileName).toEqual('featured-item-test-image-3.png')
    expect(updatedFeaturedItemsResponse[2].imageFileUrl).toBe(
      `http://localhost:8080/api/access/dataverseFeatureItemImage/${updatedFeaturedItemsResponse[2].id}`
    )
  })

  test('should throw an error when collection does not exist', async () => {
    const newFeaturedItems: CollectionFeaturedItemsDTO = [
      {
        content: '<p class="rte-paragraph">Test content 1</p>',
        displayOrder: 0,
        file: undefined,
        keepFile: false
      },
      {
        content: '<p class="rte-paragraph">Test content 2</p>',
        displayOrder: 1,
        file: undefined,
        keepFile: false
      },
      {
        content: '<p class="rte-paragraph">Test content 3</p>',
        displayOrder: 2,
        file: createImageFile('featured-item-test-image-3.png'),
        keepFile: false
      }
    ]
    const invalidCollectionAlias = 'invalid-collection-alias'
    let writeError: WriteError | undefined

    try {
      await updateCollectionFeaturedItems.execute(invalidCollectionAlias, newFeaturedItems)
    } catch (error) {
      writeError = error
    } finally {
      expect(writeError).toBeInstanceOf(WriteError)
      expect((writeError as WriteError).message).toEqual(
        `There was an error when writing the resource. Reason was: [404] Can't find dataverse with identifier='${invalidCollectionAlias}'`
      )
    }
  })

  // TODO:ME - Returning a 500 instead of a proper error message indicating which item property has an error.
  //   test('should throw an error when featured item content is empty', async () => {
  //     const newFeaturedItems: CollectionFeaturedItemsDTO = [
  //       {
  //         content: '',
  //         displayOrder: 0,
  //         file: undefined,
  //         keepFile: false
  //       }
  //     ]
  //     let writeError: WriteError | undefined

  //     try {
  //       await updateCollectionFeaturedItems.execute(testCollectionAlias, newFeaturedItems)
  //     } catch (error) {
  //       writeError = error
  //     } finally {
  //       expect(writeError).toBeInstanceOf(WriteError)
  //       expect((writeError as WriteError).message).toEqual(
  //         'There was an error when writing the resource. Reason was: [400] Content cannot be empty'
  //       )
  //     }
  //   })

  // TODO:ME - Currently not throwing an error and saving them with the same display order.
  //   test('should throw an error when featured items have the same display order', async () => {
  //     const newFeaturedItems: CollectionFeaturedItemsDTO = [
  //       {
  //         content: '<p class="rte-paragraph">Test content 1</p>',
  //         displayOrder: 0,
  //         file: undefined,
  //         keepFile: false
  //       },
  //       {
  //         content: '<p class="rte-paragraph">Test content 2</p>',
  //         displayOrder: 0,
  //         file: undefined,
  //         keepFile: false
  //       }
  //     ]
  //     let writeError: WriteError | undefined

  //     try {
  //       const resp = await updateCollectionFeaturedItems.execute(
  //         testCollectionAlias,
  //         newFeaturedItems
  //       )
  //       console.log({ resp })
  //     } catch (error) {
  //       writeError = error
  //     } finally {
  //       expect(writeError).toBeInstanceOf(WriteError)
  //       expect((writeError as WriteError).message).toEqual(
  //         'There was an error when writing the resource. Reason was: [400] Display order must be unique'
  //       )
  //     }
  //   })

  describe('keepFile behaviour', () => {
    let testFeaturedItemId: number

    const testFeaturedItemContent = '<p class="rte-paragraph">Test content</p>'
    const testFeaturedItemFilename = 'featured-item-test-image.png'

    beforeEach(async () => {
      try {
        const featuredItemCreated = await createCollectionFeaturedItemViaApi(testCollectionAlias, {
          content: testFeaturedItemContent,
          displayOrder: 1,
          withFile: true,
          fileName: testFeaturedItemFilename
        })

        testFeaturedItemId = featuredItemCreated.id
      } catch (error) {
        throw new Error(`Error while creating collection featured item in ${testCollectionAlias}`)
      }
    })

    afterEach(async () => {
      try {
        await deleteCollectionFeaturedItemViaApi(testFeaturedItemId)
      } catch (error) {
        throw new Error(
          `Tests afterAll(): Error while deleting featured item with id ${testFeaturedItemId}`
        )
      }
    })

    it('should keep existing file for a featured item if file is undefined and keepFile is true', async () => {
      const newFeaturedItems: CollectionFeaturedItemsDTO = [
        {
          id: testFeaturedItemId,
          content: '<p class="rte-paragraph">Test content Updated</p>',
          displayOrder: 0,
          file: undefined,
          keepFile: true
        }
      ]

      const updatedFeaturedItemsResponse = await updateCollectionFeaturedItems.execute(
        testCollectionAlias,
        newFeaturedItems
      )

      expect(updatedFeaturedItemsResponse.length).toBe(1)

      // expect(updatedFeaturedItemsResponse[0].content).toBe(newFeaturedItems[0].content)
      expect(updatedFeaturedItemsResponse[0].displayOrder).toBe(newFeaturedItems[0].displayOrder)
      // Should keep the existing file even if a file was not provided because keepFile is true
      expect(updatedFeaturedItemsResponse[0].imageFileName).toEqual(testFeaturedItemFilename)
      expect(updatedFeaturedItemsResponse[0].imageFileUrl).toBe(
        `http://localhost:8080/api/access/dataverseFeatureItemImage/${updatedFeaturedItemsResponse[0].id}`
      )
    })

    it('should remove existing file for a featured item if file is undefined and keepFile is false', async () => {
      const newFeaturedItems: CollectionFeaturedItemsDTO = [
        {
          id: testFeaturedItemId,
          content: '<p class="rte-paragraph">Test content Updated</p>',
          displayOrder: 0,
          file: undefined,
          keepFile: false
        }
      ]

      const updatedFeaturedItemsResponse = await updateCollectionFeaturedItems.execute(
        testCollectionAlias,
        newFeaturedItems
      )

      expect(updatedFeaturedItemsResponse.length).toBe(1)

      // expect(updatedFeaturedItemsResponse[0].content).toBe(newFeaturedItems[0].content)
      expect(updatedFeaturedItemsResponse[0].displayOrder).toBe(newFeaturedItems[0].displayOrder)
      expect(updatedFeaturedItemsResponse[0].imageFileUrl).toBeUndefined()
      expect(updatedFeaturedItemsResponse[0].imageFileName).toBeUndefined()
    })

    it('should replace existing file for a featured item if a new file is provided and keepFile is false', async () => {
      const newFeaturedItems: CollectionFeaturedItemsDTO = [
        {
          id: testFeaturedItemId,
          content: '<p class="rte-paragraph">Test content Updated</p>',
          displayOrder: 0,
          file: createImageFile('featured-item-test-image-updated.png'),
          keepFile: false
        }
      ]

      const updatedFeaturedItemsResponse = await updateCollectionFeaturedItems.execute(
        testCollectionAlias,
        newFeaturedItems
      )

      expect(updatedFeaturedItemsResponse.length).toBe(1)

      // expect(updatedFeaturedItemsResponse[0].content).toBe(newFeaturedItems[0].content)
      expect(updatedFeaturedItemsResponse[0].displayOrder).toBe(newFeaturedItems[0].displayOrder)
      expect(updatedFeaturedItemsResponse[0].imageFileName).toEqual(
        'featured-item-test-image-updated.png'
      )
      expect(updatedFeaturedItemsResponse[0].imageFileUrl).toBe(
        `http://localhost:8080/api/access/dataverseFeatureItemImage/${updatedFeaturedItemsResponse[0].id}`
      )
    })

    it('should not replace existing file for a featured item if a new file is provided but keepFile is true', async () => {
      const newFeaturedItems: CollectionFeaturedItemsDTO = [
        {
          id: testFeaturedItemId,
          content: '<p class="rte-paragraph">Test content Updated</p>',
          displayOrder: 0,
          file: createImageFile('featured-item-test-image-updated.png'),
          keepFile: true
        }
      ]

      const updatedFeaturedItemsResponse = await updateCollectionFeaturedItems.execute(
        testCollectionAlias,
        newFeaturedItems
      )

      expect(updatedFeaturedItemsResponse.length).toBe(1)

      // expect(updatedFeaturedItemsResponse[0].content).toBe(newFeaturedItems[0].content)
      expect(updatedFeaturedItemsResponse[0].displayOrder).toBe(newFeaturedItems[0].displayOrder)
      // Should keep the existing file even if a file was provided because keepFile is true
      expect(updatedFeaturedItemsResponse[0].imageFileName).toEqual(testFeaturedItemFilename)
      expect(updatedFeaturedItemsResponse[0].imageFileUrl).toBe(
        `http://localhost:8080/api/access/dataverseFeatureItemImage/${updatedFeaturedItemsResponse[0].id}`
      )
    })
  })
})
