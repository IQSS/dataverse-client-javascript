import { CollectionDTO } from '../dtos/CollectionDTO'
import { FeaturedItemsDTO } from '../dtos/FeaturedItemsDTO'
import { Collection } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'
import { FeaturedItem } from '../models/FeaturedItem'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { MyDataCollectionItemSubset } from '../models/MyDataCollectionItemSubset'
import { CollectionSearchCriteria } from '../models/CollectionSearchCriteria'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'
import { PublicationStatus } from '../../../core/domain/models/PublicationStatus'
import { CollectionItemType } from '../../../collections/domain/models/CollectionItemType'
import { CollectionLinks } from '../models/CollectionLinks'
import { CollectionSummary } from '../models/CollectionSummary'
import { AllowedStorageDrivers } from '../models/AllowedStorageDrivers'
import { StorageDriver } from '../../../core/domain/models/StorageDriver'
import { LinkingObjectType } from '../useCases/GetCollectionsForLinking'

export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>
  getCollectionStorageDriver(
    collectionIdOrAlias: number | string,
    getEffective?: boolean
  ): Promise<StorageDriver>
  setCollectionStorageDriver(
    collectionIdOrAlias: number | string,
    driverLabel: string
  ): Promise<string>
  deleteCollectionStorageDriver(collectionIdOrAlias: number | string): Promise<string>
  getAllowedCollectionStorageDrivers(
    collectionIdOrAlias: number | string
  ): Promise<AllowedStorageDrivers>
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
  assignRoleOnCollection(
    collectionIdOrAlias: number | string,
    roleAssignee: string,
    roleAlias: string
  ): Promise<void>
  unassignRoleOnCollection(
    collectionIdOrAlias: number | string,
    roleAssignmentId: number
  ): Promise<void>
  getCollectionItems(
    collectionId?: string,
    limit?: number,
    offset?: number,
    collectionSearchCriteria?: CollectionSearchCriteria,
    searchServiceName?: string,
    showTypeCounts?: boolean
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
    updatedCollection: Partial<CollectionDTO>
  ): Promise<void>
  getCollectionFeaturedItems(collectionIdOrAlias: number | string): Promise<FeaturedItem[]>
  updateCollectionFeaturedItems(
    collectionIdOrAlias: number | string,
    featuredItemDTOs: FeaturedItemsDTO
  ): Promise<FeaturedItem[]>
  deleteCollectionFeaturedItems(collectionIdOrAlias: number | string): Promise<void>
  deleteCollectionFeaturedItem(featuredItemId: number): Promise<void>
  linkCollection(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void>
  unlinkCollection(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void>
  getCollectionLinks(collectionIdOrAlias: number | string): Promise<CollectionLinks>
  getCollectionsForLinking(
    objectType: LinkingObjectType,
    id: number | string,
    searchTerm: string,
    alreadyLinked: boolean
  ): Promise<CollectionSummary[]>
}
