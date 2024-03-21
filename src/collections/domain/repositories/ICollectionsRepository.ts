import { Collection } from '../models/Collection'
export interface ICollectionsRepository {
  getCollection(collectionIdOrAlias: number | string): Promise<Collection>
}
