import { CreateCollection } from './domain/useCases/CreateCollection'
import { GetCollection } from './domain/useCases/GetCollection'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const createCollection = new CreateCollection(collectionsRepository)

export { getCollection, createCollection }
export { Collection } from './domain/models/Collection'
