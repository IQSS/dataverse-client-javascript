import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'
import { GetCollectionFacets } from './domain/useCases/GetCollectionFacets'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const createCollection = new CreateCollection(collectionsRepository)
const getCollectionFacets = new GetCollectionFacets(collectionsRepository)

export { getCollection, createCollection, getCollectionFacets }
export { Collection } from './domain/models/Collection'
export { CollectionDTO, DatasetFieldTypeInputLevelDTO } from './domain/dtos/CollectionDTO'
