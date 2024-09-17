import { PublicationStatus } from '../../../core/domain/models/PublicationStatus'
import { CollectionItemType } from './CollectionItemType'

export interface CollectionPreview {
  type: CollectionItemType.COLLECTION
  name: string
  parentName: string
  alias: string
  parentAlias: string
  description: string
  affiliation: string
  publicationStatuses: PublicationStatus[]
  releaseOrCreateDate: Date
  imageUrl?: string
}
