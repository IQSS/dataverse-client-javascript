import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'
import { GetCollectionFacets } from './domain/useCases/GetCollectionFacets'
import { GetCollectionUserPermissions } from './domain/useCases/GetCollectionUserPermissions'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'
import { PublishCollection } from './domain/useCases/PublishCollection'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const createCollection = new CreateCollection(collectionsRepository)
const getCollectionFacets = new GetCollectionFacets(collectionsRepository)
const getCollectionUserPermissions = new GetCollectionUserPermissions(collectionsRepository)
const publishCollection = new PublishCollection(collectionsRepository)

export {
  getCollection,
  createCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  publishCollection
}
export { Collection, CollectionInputLevel } from './domain/models/Collection'
export { CollectionFacet } from './domain/models/CollectionFacet'
export { CollectionUserPermissions } from './domain/models/CollectionUserPermissions'
export { CollectionDTO, CollectionInputLevelDTO } from './domain/dtos/CollectionDTO'
