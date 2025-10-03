import { MetadataBlock } from '../models/MetadataBlock'

export interface IMetadataBlocksRepository {
  getMetadataBlockByName(metadataBlockName: string): Promise<MetadataBlock>

  getCollectionMetadataBlocks(
    collectionIdOrAlias: number | string,
    onlyDisplayedOnCreate: boolean,
    datasetType?: string
  ): Promise<MetadataBlock[]>

  getAllMetadataBlocks(): Promise<MetadataBlock[]>
}
