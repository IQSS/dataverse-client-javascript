import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  DvObjectFeaturedItem
} from '../../../domain/models/CollectionFeaturedItem'
import {
  CollectionFeaturedItemPayload,
  DvObjectFeaturedItemPayload
} from './CollectionFeaturedItemPayload'

const dvObjectTypeMap: Record<DvObjectFeaturedItemPayload['type'], DvObjectFeaturedItem['type']> = {
  dataverse: 'collection',
  dataset: 'dataset',
  datafile: 'file'
}

export const transformCollectionFeaturedItemsPayloadToCollectionFeaturedItems = (
  payload: CollectionFeaturedItemPayload[]
): CollectionFeaturedItem[] => {
  return payload
    .map((item) => {
      if (item.type === 'custom') {
        const customFeaturedItem: CustomFeaturedItem = {
          id: item.id,
          type: 'custom',
          content: item.content,
          imageFileUrl: item.imageFileUrl || undefined,
          imageFileName: item.imageFileName || undefined,
          displayOrder: item.displayOrder
        }

        return customFeaturedItem
      } else {
        // Map API types to domain types
        const type = dvObjectTypeMap[item.type]

        if (!type) {
          throw new Error(`Unknown dvObject type: ${item.type}`)
        }

        const dvObjectFeaturedItem: DvObjectFeaturedItem = {
          id: item.id,
          type,
          dvObjectIdentifier: item.dvObjectIdentifier,
          displayOrder: item.displayOrder
        }

        return dvObjectFeaturedItem
      }
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)
}
