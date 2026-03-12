import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'
import { GetCollectionFacets } from './domain/useCases/GetCollectionFacets'
import { GetCollectionUserPermissions } from './domain/useCases/GetCollectionUserPermissions'
import { GetCollectionItems } from './domain/useCases/GetCollectionItems'
import { GetCollectionStorageDriver } from './domain/useCases/GetCollectionStorageDriver'
import { PublishCollection } from './domain/useCases/PublishCollection'
import { UpdateCollection } from './domain/useCases/UpdateCollection'
import { GetCollectionFeaturedItems } from './domain/useCases/GetCollectionFeaturedItems'
import { CollectionsRepository } from './infra/repositories/CollectionsRepository'
import { UpdateCollectionFeaturedItems } from './domain/useCases/UpdateCollectionFeaturedItems'
import { DeleteCollectionFeaturedItems } from './domain/useCases/DeleteCollectionFeaturedItems'
import { DeleteCollection } from './domain/useCases/DeleteCollection'
import { GetMyDataCollectionItems } from './domain/useCases/GetMyDataCollectionItems'
import { DeleteCollectionFeaturedItem } from './domain/useCases/DeleteCollectionFeaturedItem'
import { LinkCollection } from './domain/useCases/LinkCollection'
import { UnlinkCollection } from './domain/useCases/UnlinkCollection'
import { GetCollectionLinks } from './domain/useCases/GetCollectionLinks'
import { GetCollectionsForLinking } from './domain/useCases/GetCollectionsForLinking'
import { SetCollectionStorageDriver } from './domain/useCases/SetCollectionStorageDriver'
import { DeleteCollectionStorageDriver } from './domain/useCases/DeleteCollectionStorageDriver'
import { GetAllowedCollectionStorageDrivers } from './domain/useCases/GetAllowedCollectionStorageDrivers'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const getCollectionStorageDriver = new GetCollectionStorageDriver(collectionsRepository)
const createCollection = new CreateCollection(collectionsRepository)
const getCollectionFacets = new GetCollectionFacets(collectionsRepository)
const getCollectionUserPermissions = new GetCollectionUserPermissions(collectionsRepository)
const getCollectionItems = new GetCollectionItems(collectionsRepository)
const getMyDataCollectionItems = new GetMyDataCollectionItems(collectionsRepository)
const publishCollection = new PublishCollection(collectionsRepository)
const updateCollection = new UpdateCollection(collectionsRepository)
const getCollectionFeaturedItems = new GetCollectionFeaturedItems(collectionsRepository)
const updateCollectionFeaturedItems = new UpdateCollectionFeaturedItems(collectionsRepository)
const deleteCollectionFeaturedItems = new DeleteCollectionFeaturedItems(collectionsRepository)
const deleteCollection = new DeleteCollection(collectionsRepository)
const deleteCollectionFeaturedItem = new DeleteCollectionFeaturedItem(collectionsRepository)
const linkCollection = new LinkCollection(collectionsRepository)
const unlinkCollection = new UnlinkCollection(collectionsRepository)
const getCollectionLinks = new GetCollectionLinks(collectionsRepository)
const getCollectionsForLinking = new GetCollectionsForLinking(collectionsRepository)
const setCollectionStorageDriver = new SetCollectionStorageDriver(collectionsRepository)
const deleteCollectionStorageDriver = new DeleteCollectionStorageDriver(collectionsRepository)
const getAllowedCollectionStorageDrivers = new GetAllowedCollectionStorageDrivers(
  collectionsRepository
)

export {
  getCollection,
  getCollectionStorageDriver,
  createCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  getCollectionItems,
  getMyDataCollectionItems,
  publishCollection,
  updateCollection,
  getCollectionFeaturedItems,
  updateCollectionFeaturedItems,
  deleteCollectionFeaturedItems,
  deleteCollection,
  deleteCollectionFeaturedItem,
  linkCollection,
  unlinkCollection,
  getCollectionLinks,
  getCollectionsForLinking,
  setCollectionStorageDriver,
  deleteCollectionStorageDriver,
  getAllowedCollectionStorageDrivers
}
export { Collection, CollectionInputLevel } from './domain/models/Collection'
export { CollectionFacet } from './domain/models/CollectionFacet'
export { CollectionUserPermissions } from './domain/models/CollectionUserPermissions'
export { CollectionDTO, CollectionInputLevelDTO } from './domain/dtos/CollectionDTO'
export { CollectionPreview } from './domain/models/CollectionPreview'
export { CollectionItemType } from './domain/models/CollectionItemType'
export { CollectionSearchCriteria } from './domain/models/CollectionSearchCriteria'
export { FeaturedItem } from './domain/models/FeaturedItem'
export { FeaturedItemsDTO } from './domain/dtos/FeaturedItemsDTO'
export { CollectionSummary } from './domain/models/CollectionSummary'
export { AllowedStorageDrivers } from './domain/models/AllowedStorageDrivers'
export { StorageDriver } from '../core/domain/models/StorageDriver'
