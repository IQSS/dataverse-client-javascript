import { DvObjectOwnerNode } from '../../../core'
import { CollectionContact } from './CollectionContact'
import { CollectionType } from './CollectionType'
import { DatasetType } from '../../../datasets'

export interface Collection {
  id: number
  alias: string
  name: string
  isReleased: boolean
  affiliation?: string
  description?: string
  isPartOf: DvObjectOwnerNode
  inputLevels?: CollectionInputLevel[]
  type: CollectionType
  contacts?: CollectionContact[]
  allowedDatasetTypes?: DatasetType[]
  isMetadataBlockRoot: boolean
  isFacetRoot: boolean
  childCount: number
  theme?: CollectionTheme
}

export interface CollectionTheme {
  id: number
  logo?: string
  tagline?: string
  linkUrl?: string
  linkColor?: string
  textColor?: string
  backgroundColor?: string
  logoBackgroundColor?: string
}

export interface CollectionInputLevel {
  datasetFieldName: string
  include: boolean
  required: boolean
}

export const ROOT_COLLECTION_ID = ':root'
