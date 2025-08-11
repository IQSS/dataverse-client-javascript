import { CollectionSummary } from './CollectionSummary'
import { DatasetSummary } from '../../../datasets/domain/models/DatasetSummary'

export interface CollectionLinks {
  linkedCollections: CollectionSummary[]
  collectionsLinkingToThis: CollectionSummary[]
  linkedDatasets: DatasetSummary[]
}
