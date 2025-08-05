import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'
import { GetCollectionFacets } from './domain/useCases/GetCollectionFacets'
import { GetCollectionUserPermissions } from './domain/useCases/GetCollectionUserPermissions'
import { GetCollectionItems } from './domain/useCases/GetCollectionItems'
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
import { UnLinkCollection } from './domain/useCases/UnLinkCollection'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
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
const unlinkCollection = new UnLinkCollection(collectionsRepository)

export {
  getCollection,
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
  unlinkCollection
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
