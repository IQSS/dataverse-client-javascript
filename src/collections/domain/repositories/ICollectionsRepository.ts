import { Collection } from '../models/Collection'
import { MetadataBlock } from '../../../metadataBlocks'

export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>

  getCollectionMetadataBlocks(
    collectionIdOrAlias: number | string,
    onlyDisplayedOnCreate: boolean
  ): Promise<MetadataBlock[]>
}
