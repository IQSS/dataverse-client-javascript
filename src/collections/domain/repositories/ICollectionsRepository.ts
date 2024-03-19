import { Collection } from '../models/Collection'
export interface ICollectionsRepository {
  getCollection(collectionObjectParameter: number | string): Promise<Collection>
}
