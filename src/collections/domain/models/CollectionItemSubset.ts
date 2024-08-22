import { DatasetPreview } from '../../../datasets'
import { FilePreview } from '../../../files'

export interface CollectionItemSubset {
  items: (DatasetPreview | FilePreview)[]
  totalItemCount: number
}
