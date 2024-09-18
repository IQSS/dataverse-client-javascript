import { DatasetPreview } from '../../../datasets'
import { FilePreview } from '../../../files'
import { CollectionPreview } from './CollectionPreview'

export interface CollectionItemSubset {
  items: (CollectionPreview | DatasetPreview | FilePreview)[]
  totalItemCount: number
}
