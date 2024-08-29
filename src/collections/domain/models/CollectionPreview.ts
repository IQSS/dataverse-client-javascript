import { PublicationStatus } from '../../../core/domain/models/PublicationStatus'

export interface CollectionPreview {
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
