import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'
import { GetCollectionFacets } from './domain/useCases/GetCollectionFacets'
import { GetCollectionItems } from './domain/useCases/GetCollectionItems'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const createCollection = new CreateCollection(collectionsRepository)
const getCollectionFacets = new GetCollectionFacets(collectionsRepository)
const getCollectionItems = new GetCollectionItems(collectionsRepository)

export { getCollection, createCollection, getCollectionFacets, getCollectionItems }
export { Collection, CollectionInputLevel } from './domain/models/Collection'
export { CollectionDTO, CollectionInputLevelDTO } from './domain/dtos/CollectionDTO'
