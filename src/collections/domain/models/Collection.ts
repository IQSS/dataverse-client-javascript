import { DvObjectOwnerNode } from '../../../core'
import { CollectionContact } from './CollectionContact'
import { CollectionType } from './CollectionType'

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
  usesMetadataFieldsFromParent: boolean
  usesBrowseSearchFacetsFromParent: boolean
}

export interface CollectionInputLevel {
  datasetFieldName: string
  include: boolean
  required: boolean
}

export const ROOT_COLLECTION_ID = ':root'
