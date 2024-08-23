import { CollectionDTO } from '../dtos/CollectionDTO'
import { Collection } from '../models/Collection'
import { CollectionItemSubset } from '../models/CollectionItemSubset'

export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>
  createCollection(
    collectionDTO: CollectionDTO,
    parentCollectionId: number | string
  ): Promise<number>
  getCollectionFacets(collectionIdOrAlias: number | string): Promise<string[]>
  getCollectionItems(
    collectionId?: string,
    limit?: number,
    offset?: number
  ): Promise<CollectionItemSubset>
}
