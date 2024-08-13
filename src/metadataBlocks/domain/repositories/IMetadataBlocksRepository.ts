import { MetadataBlock } from '../models/MetadataBlock'

export interface IMetadataBlocksRepository {
  getMetadataBlockByName(metadataBlockName: string): Promise<MetadataBlock>

  getCollectionMetadataBlocks(
    collectionIdOrAlias: number | string,
    onlyDisplayedOnCreate: boolean
  ): Promise<MetadataBlock[]>

  getAllMetadataBlocks(): Promise<MetadataBlock[]>
}
