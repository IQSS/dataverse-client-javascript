import { CollectionDTO } from '../dtos/CollectionDTO'
import { Collection } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../models/CollectionSearchCriteria'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'

export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>
  createCollection(
    collectionDTO: CollectionDTO,
    parentCollectionId: number | string
  ): Promise<number>
  publishCollection(collectionIdOrAlias: number | string): Promise<void>
  getCollectionFacets(collectionIdOrAlias: number | string): Promise<CollectionFacet[]>
  getCollectionUserPermissions(
    collectionIdOrAlias: number | string
  ): Promise<CollectionUserPermissions>
  getCollectionItems(
    collectionId?: string,
    limit?: number,
    offset?: number,
    collectionSearchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset>
}
