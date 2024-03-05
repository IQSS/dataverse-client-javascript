import { MetadataBlock } from '../models/MetadataBlock'

export interface IMetadataBlocksRepository {
  getMetadataBlockByName(metadataBlockName: string): Promise<MetadataBlock>
}
