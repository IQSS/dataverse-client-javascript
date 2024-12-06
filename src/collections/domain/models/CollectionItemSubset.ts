import { DatasetPreview } from '../../../datasets'
import { FilePreview } from '../../../files'
import { CollectionPreview } from './CollectionPreview'

export interface CollectionItemSubset {
  items: (CollectionPreview | DatasetPreview | FilePreview)[]
  facets: CollectionItemsFacet[]
  totalItemCount: number
}

export interface CollectionItemsFacet {
  [key: string]: CollectionItemsFacetValue
}

interface CollectionItemsFacetValue {
  friendly: string
  labels: CollectionItemsFacetLabel[]
}

interface CollectionItemsFacetLabel {
  name: string
  count: number
}
