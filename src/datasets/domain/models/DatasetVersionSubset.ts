import { Dataset, DatasetMetadataBlocks } from './Dataset'

export interface DatasetVersionSubset {
  versions: Array<Omit<Dataset, 'metadataBlocks'> & { metadataBlocks?: DatasetMetadataBlocks }>
}
