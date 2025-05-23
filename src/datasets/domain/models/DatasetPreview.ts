import { CollectionItemType } from '../../../collections'
import { PublicationStatus } from '../../../core/domain/models/PublicationStatus'
import { DatasetVersionInfo } from './Dataset'

export interface DatasetPreview {
  type: CollectionItemType.DATASET
  persistentId: string
  title: string
  versionId: number
  versionInfo: DatasetVersionInfo
  citation: string
  description: string
  publicationStatuses: PublicationStatus[]
  publicationDate?: string
  parentCollectionName: string
  parentCollectionAlias: string
  imageUrl?: string
  userRoles?: string[]
}
