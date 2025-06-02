import { CollectionPreview } from './CollectionPreview'
import { DatasetPreview } from '../../../datasets'
import { FilePreview } from '../../../files'
import { CountPerObjectType } from './CollectionItemSubset'
import { PublicationStatus } from '../../../../src/core/domain/models/PublicationStatus'

export interface MyDataCollectionItemSubset {
  items: (CollectionPreview | DatasetPreview | FilePreview)[]
  publicationStatusCounts: PublicationStatusCount[]
  totalItemCount: number
  countPerObjectType: CountPerObjectType
}

export interface PublicationStatusCount {
  publicationStatus: PublicationStatus
  count: number
}
