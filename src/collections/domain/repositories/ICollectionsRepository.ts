import { CollectionDTO } from '../dtos/CollectionDTO'
import { CollectionFeaturedItemsDTO } from '../dtos/CollectionFeaturedItemsDTO'
import { Collection } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'
import { CollectionFeaturedItem } from '../models/CollectionFeaturedItem'
import { CollectionItemSubset, MyDataCollectionItemSubset } from '../models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../models/CollectionSearchCriteria'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'
import { PublicationStatus } from '../../../../src/core/domain/models/PublicationStatus'
import { CollectionItemType } from '../../../../src/collections/domain/models/CollectionItemType'

export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>
  createCollection(
    collectionDTO: CollectionDTO,
    parentCollectionId: number | string
  ): Promise<number>
  publishCollection(collectionIdOrAlias: number | string): Promise<void>
  deleteCollection(collectionIdOrAlias: number | string): Promise<void>
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
  getMyDataCollectionItems(
    roleIds: number[],
    collectionItemTypes: CollectionItemType[],
    publicationStatuses: PublicationStatus[],
    limit?: number,
    selectedPage?: number,
    searchText?: string,
    otherUserName?: string
  ): Promise<MyDataCollectionItemSubset>
  updateCollection(
    collectionIdOrAlias: number | string,
    updatedCollection: CollectionDTO
  ): Promise<void>
  getCollectionFeaturedItems(
    collectionIdOrAlias: number | string
  ): Promise<CollectionFeaturedItem[]>
  updateCollectionFeaturedItems(
    collectionIdOrAlias: number | string,
    featuredItemDTOs: CollectionFeaturedItemsDTO
  ): Promise<CollectionFeaturedItem[]>
  deleteCollectionFeaturedItems(collectionIdOrAlias: number | string): Promise<void>
}
