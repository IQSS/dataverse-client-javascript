import {
  FeaturedItem,
  CustomFeaturedItem,
  DvObjectFeaturedItem,
  FeaturedItemType
} from '../../../domain/models/FeaturedItem'
import {
  CollectionFeaturedItemPayload,
  DvObjectFeaturedItemPayload
} from './CollectionFeaturedItemPayload'

const apiTypeToDomainType: Record<
  DvObjectFeaturedItemPayload['type'],
  DvObjectFeaturedItem['type']
> = {
  dataverse: FeaturedItemType.COLLECTION,
  dataset: FeaturedItemType.DATASET,
  datafile: FeaturedItemType.FILE
}

export const domainTypeToApiType: Record<
  DvObjectFeaturedItem['type'],
  DvObjectFeaturedItemPayload['type']
> = {
  [FeaturedItemType.COLLECTION]: 'dataverse',
  [FeaturedItemType.DATASET]: 'dataset',
  [FeaturedItemType.FILE]: 'datafile'
}

export const transformFeaturedItemsPayloadToFeaturedItems = (
  payload: CollectionFeaturedItemPayload[]
): FeaturedItem[] => {
  return payload
    .map((item) => {
      if (item.type === 'custom') {
        const customFeaturedItem: CustomFeaturedItem = {
          id: item.id,
          type: FeaturedItemType.CUSTOM,
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
          dvObjectDisplayName: item.dvObjectDisplayName,
          displayOrder: item.displayOrder
        }

        return dvObjectFeaturedItem
      }
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)
}
