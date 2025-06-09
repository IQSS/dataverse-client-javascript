import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  DvObjectFeaturedItem,
  DvObjectFeaturedItemType
} from '../../../domain/models/CollectionFeaturedItem'
import {
  CollectionFeaturedItemPayload,
  DvObjectFeaturedItemPayload
} from './CollectionFeaturedItemPayload'

const apiTypeToDomainType: Record<
  DvObjectFeaturedItemPayload['type'],
  DvObjectFeaturedItem['type']
> = {
  dataverse: DvObjectFeaturedItemType.COLLECTION,
  dataset: DvObjectFeaturedItemType.DATASET,
  datafile: DvObjectFeaturedItemType.FILE
}

export const domainTypeToApiType: Record<
  DvObjectFeaturedItem['type'],
  DvObjectFeaturedItemPayload['type']
> = {
  [DvObjectFeaturedItemType.COLLECTION]: 'dataverse',
  [DvObjectFeaturedItemType.DATASET]: 'dataset',
  [DvObjectFeaturedItemType.FILE]: 'datafile'
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
        const type = apiTypeToDomainType[item.type]

        if (!type) {
          throw new Error(`Unknown type: ${item.type}`)
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
