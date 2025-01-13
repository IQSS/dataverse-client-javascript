import axios from 'axios'
import { File, Blob } from '@web-std/file'
import { CollectionFeaturedItem } from '../../../src/collections/domain/models/CollectionFeaturedItem'
import { ROOT_COLLECTION_ID } from '../../../src/collections/domain/models/Collection'
import { TestConstants } from '../TestConstants'
import { CollectionFeaturedItemsDTO } from '../../../src'

interface CreateCollectionFeaturedItemData {
  content: string
  displayOrder?: number
  withFile?: boolean
  fileName?: string
}

export async function createCollectionFeaturedItemViaApi(
  collectionAlias: string,
  {
    content,
    displayOrder = 1,
    withFile = false,
    fileName = 'test-image.png'
  }: CreateCollectionFeaturedItemData
): Promise<CollectionFeaturedItem> {
  try {
    if (collectionAlias == undefined) {
      collectionAlias = ROOT_COLLECTION_ID
    }

    const formData = new FormData()
    formData.append('content', content)
    formData.append('displayOrder', displayOrder.toString())

    if (withFile) {
      const file = createImageFile(fileName)

      formData.append('file', file)
    }

    return await axios
      .post(`${TestConstants.TEST_API_URL}/dataverses/${collectionAlias}/featuredItem`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Dataverse-Key': process.env.TEST_API_KEY
        }
      })
      .then((response) => {
        // console.log({ singleFeatItemCreated: JSON.stringify(response.data.data) })
        return response.data.data
      })
  } catch (error) {
    console.log(error)
    throw new Error(`Error while creating collection featured item in ${collectionAlias}`)
  }
}

export async function deleteCollectionFeaturedItemViaApi(featuredItemId: number): Promise<void> {
  try {
    return await axios.delete(
      `${TestConstants.TEST_API_URL}/dataverseFeaturedItems/${featuredItemId.toString()}`,
      {
        headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
      }
    )
    // .then((resp) => {
    //   console.log({ deletedResp: JSON.stringify(resp.data) })
    // })
  } catch (error) {
    throw new Error(`Error while deleting collection featured item with id ${featuredItemId}`)
  }
}

export async function deleteAllCollectionFeaturedItemsViaApi(collectionAlias: string) {
  try {
    return await axios.delete(
      `${TestConstants.TEST_API_URL}/dataverses/${collectionAlias}/featuredItems`,
      {
        headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
      }
    )
    // .then((resp) => {
    //   console.log({ deletedAllResp: JSON.stringify(resp.data) })
    // })
  } catch (error) {
    console.log(error)
    throw new Error(`Error while deleting all featured items from collection: ${collectionAlias}`)
  }
}

export const createCollectionFeaturedItemsModel = (): CollectionFeaturedItem[] => {
  return [
    {
      id: 1,
      content: 'This is a featured item',
      displayOrder: 1,
      imageFileName: 'test-image.png',
      imageFileUrl: 'http://localhost:8080/api/access/dataverseFeatureItemImage/1'
    },
    {
      id: 2,
      content: 'This is another featured item',
      displayOrder: 2,
      imageFileName: undefined,
      imageFileUrl: undefined
    }
  ]
}

export const createCollectionFeaturedItemsDTO = (): CollectionFeaturedItemsDTO => {
  return [
    {
      id: 1,
      content: 'This is a featured item',
      displayOrder: 1,
      file: createImageFile(),
      keepFile: false
    },
    {
      id: 2,
      content: 'This is another featured item',
      displayOrder: 2,
      file: undefined,
      keepFile: false
    }
  ]
}

export function createImageFile(fileName = 'test-image.png'): File {
  // Binary data for a 1x1 black pixel PNG image
  const imageData = Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x60, 0x00, 0x00, 0x00,
    0x02, 0x00, 0x01, 0xe2, 0x21, 0xbc, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82
  ])

  const blob = new Blob([imageData], { type: 'image/png' })
  const imageFile = new File([blob], fileName, { type: 'image/png' })

  return imageFile
}
