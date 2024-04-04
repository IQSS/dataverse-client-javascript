import { GetCollection } from './domain/useCases/GetCollection'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)

export { getCollection }
export { Collection } from './domain/models/Collection'
