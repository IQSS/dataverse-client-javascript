import { DatasetPreview } from '../../../datasets'
import { FilePreview } from '../../../files'
import { CollectionPreview } from './CollectionPreview'

export interface CollectionItemSubset {
  items: (CollectionPreview | DatasetPreview | FilePreview)[]
  facets: CollectionItemsFacet[]
  totalItemCount: number
  countPerObjectType: CountPerObjectType
}

export interface CollectionItemsFacet {
  name: string
  friendlyName: string
  labels: CollectionItemsFacetLabel[]
}

interface CollectionItemsFacetLabel {
  name: string
  count: number
}

interface CountPerObjectType {
  dataverses: number
  datasets: number
  files: number
}
