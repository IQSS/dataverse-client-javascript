import { GetCollection } from './domain/useCases/GetCollection'

import { CollectionsRepository } from './infra/repositories/CollectionsRepository'
import { GetCollectionMetadataBlocks } from './domain/useCases/GetCollectionMetadataBlocks'

const collectionsRepository = new CollectionsRepository()

const getCollection = new GetCollection(collectionsRepository)
const getCollectionMetadataBlocks = new GetCollectionMetadataBlocks(collectionsRepository)

export { getCollection, getCollectionMetadataBlocks }
export { Collection } from './domain/models/Collection'
