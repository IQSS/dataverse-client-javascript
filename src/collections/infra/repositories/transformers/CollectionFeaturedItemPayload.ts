export type CollectionFeaturedItemPayload = CustomFeaturedItemPayload | DvObjectFeaturedItemPayload

export interface CustomFeaturedItemPayload {
  id: number
  type: 'custom'
  content: string
  imageFileName: string | null
  imageFileUrl: string | null
  displayOrder: number
}

export interface DvObjectFeaturedItemPayload {
  id: number
  type: 'dataverse' | 'dataset' | 'datafile'
  dvObjectIdentifier: string
  dvObjectDisplayName: string
  displayOrder: number
}
