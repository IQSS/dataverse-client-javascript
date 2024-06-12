import { CollectionDTO } from '../dtos/CollectionDTO'
import { Collection } from '../models/Collection'

export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>
  createCollection(collectionDTO: CollectionDTO): Promise<void>
}
