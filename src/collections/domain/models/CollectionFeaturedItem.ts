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
  type: 'collection' | 'dataset' | 'file'
  dvObjectIdentifier: string
  displayOrder: number
}
