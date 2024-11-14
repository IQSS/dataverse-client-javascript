import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'
import { GetCollectionFacets } from './domain/useCases/GetCollectionFacets'
import { GetCollectionUserPermissions } from './domain/useCases/GetCollectionUserPermissions'
import { GetCollectionItems } from './domain/useCases/GetCollectionItems'
import { PublishCollection } from './domain/useCases/PublishCollection'
import { UpdateCollection } from './domain/useCases/UpdateCollection'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const createCollection = new CreateCollection(collectionsRepository)
const getCollectionFacets = new GetCollectionFacets(collectionsRepository)
const getCollectionUserPermissions = new GetCollectionUserPermissions(collectionsRepository)
const getCollectionItems = new GetCollectionItems(collectionsRepository)
const publishCollection = new PublishCollection(collectionsRepository)
const updateCollection = new UpdateCollection(collectionsRepository)

export {
  getCollection,
  createCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  getCollectionItems,
  publishCollection,
  updateCollection
}
export { Collection, CollectionInputLevel } from './domain/models/Collection'
export { CollectionFacet } from './domain/models/CollectionFacet'
export { CollectionUserPermissions } from './domain/models/CollectionUserPermissions'
export { CollectionDTO, CollectionInputLevelDTO } from './domain/dtos/CollectionDTO'
export { CollectionPreview } from './domain/models/CollectionPreview'
export { CollectionItemType } from './domain/models/CollectionItemType'
export { CollectionSearchCriteria } from './domain/models/CollectionSearchCriteria'
