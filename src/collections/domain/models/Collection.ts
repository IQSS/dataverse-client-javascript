import { DvObjectOwnerNode } from '../../../core'

export interface Collection {
  id: number
  alias: string
  name: string
  isReleased: boolean
  affiliation?: string
  description?: string
  isPartOf: DvObjectOwnerNode
  inputLevels?: CollectionInputLevel[]
}

export interface CollectionInputLevel {
  datasetFieldName: string
  include: boolean
  required: boolean
}

export const ROOT_COLLECTION_ALIAS = 'root'
