import { Collection } from '../models/Collection'
export interface ICollectionsRepository {
  getCollection(collectionId: number | string): Promise<Collection>
}
