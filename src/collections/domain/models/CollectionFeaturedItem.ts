export type CollectionFeaturedItem = CustomFeaturedItem | DvObjectFeaturedItem

export interface CustomFeaturedItem {
  id: number
  type: 'custom'
  content: string
  imageFileName?: string
  imageFileUrl?: string
  displayOrder: number
}

export interface DvObjectFeaturedItem {
  id: number
  type: DvObjectFeaturedItemType
  dvObjectIdentifier: string
  displayOrder: number
}

export enum DvObjectFeaturedItemType {
  COLLECTION = 'collection',
  DATASET = 'dataset',
  FILE = 'file'
}
