import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'
import { GetCollectionFacets } from './domain/useCases/GetCollectionFacets'
import { GetCollectionUserPermissions } from './domain/useCases/GetCollectionUserPermissions'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const createCollection = new CreateCollection(collectionsRepository)
const getCollectionFacets = new GetCollectionFacets(collectionsRepository)
const getCollectionUserPermissions = new GetCollectionUserPermissions(collectionsRepository)

export { getCollection, createCollection, getCollectionFacets, getCollectionUserPermissions }
export { Collection, CollectionInputLevel } from './domain/models/Collection'
export { CollectionFacet } from './domain/models/CollectionFacet'
export { CollectionUserPermissions } from './domain/models/CollectionUserPermissions'
export { CollectionDTO, CollectionInputLevelDTO } from './domain/dtos/CollectionDTO'
