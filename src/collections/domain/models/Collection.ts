import { DvObjectOwnerNode } from '../../../core'
export interface Collection {
  id: number
  alias: string
  name: string
  affiliation?: string
  description?: string
  isPartOf: DvObjectOwnerNode
}

export const ROOT_COLLECTION_ALIAS = 'root'
