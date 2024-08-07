import { CollectionDTO } from '../dtos/CollectionDTO'
import { Collection } from '../models/Collection'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'

export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>
  createCollection(
    collectionDTO: CollectionDTO,
    parentCollectionId: number | string
  ): Promise<number>
  getCollectionFacets(collectionIdOrAlias: number | string): Promise<string[]>
  getCollectionUserPermissions(
    collectionIdOrAlias: number | string
  ): Promise<CollectionUserPermissions>
}
