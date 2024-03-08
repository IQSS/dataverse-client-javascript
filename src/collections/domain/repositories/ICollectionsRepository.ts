import { Collection } from "../models/Collection"
export interface ICollectionsRepository {
  getCollection(
    collectionId: number | string,
    parentCollection: number | string,
  ): Promise<Collection>
}