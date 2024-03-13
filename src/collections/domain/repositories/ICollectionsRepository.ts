import { Collection } from '../models/Collection'
export interface ICollectionsRepository {
  getCollection(collectionId: string): Promise<Collection>
}
