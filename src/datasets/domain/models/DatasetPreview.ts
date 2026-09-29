import { CollectionItemType } from '../../../collections'
import { PublicationStatus } from '../../../core/domain/models/PublicationStatus'
import { DatasetVersionInfo } from './Dataset'
import { CollectionSummary } from '../../../collections/domain/models/CollectionSummary'
import { DatasetMetadataBlock } from './Dataset'

export interface DatasetPreview {
  type: CollectionItemType.DATASET
  persistentId: string
  title: string
  versionId: number
  versionInfo: DatasetVersionInfo
  citation: string
  description: string
  publicationStatuses: PublicationStatus[]
  parentCollectionName: string
  parentCollectionAlias: string
  imageUrl?: string
  userRoles?: string[]
  collections?: CollectionSummary[]
  metadataBlocks?: DatasetMetadataBlock[]
}
