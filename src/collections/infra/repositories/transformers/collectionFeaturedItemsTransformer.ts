import { CollectionFeaturedItem } from '../../../domain/models/CollectionFeaturedItem'
import { CollectionFeaturedItemPayload } from './CollectionFeaturedItemPayload'

export const transformCollectionFeaturedItemsPayloadToCollectionFeaturedItems = (
  collectionFeaturedItemsPayload: CollectionFeaturedItemPayload[]
): CollectionFeaturedItem[] => {
  return collectionFeaturedItemsPayload
    .map((collectionFeaturedItemPayload) => ({
      id: collectionFeaturedItemPayload.id,
      content: collectionFeaturedItemPayload.content,
      imageFileUrl: collectionFeaturedItemPayload.imageFileUrl || undefined,
      imageFileName: collectionFeaturedItemPayload.imageFileName || undefined,
      displayOrder: collectionFeaturedItemPayload.displayOrder
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder)
}
