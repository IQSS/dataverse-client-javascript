import { ApiRepository } from "../../../core/infra/repositories/ApiRepository";
import { Collection } from "../../domain/models/Collection";
import { ICollectionsRepository } from "../../domain/repositories/ICollectionsRepository";

export class CollectionsRepository extends ApiRepository implements ICollectionsRepository {
  // TODO: Need to ensure 'collections' makes it into API as we move away from calling collections 'dataverses'
  private readonly collectionsResourceName: string = 'dataverses'

  public async getCollection(collectionId: string): Promise<Collection> {
    return this.doGet(
      this.buildApiEndpoint(this.collectionsResourceName, collectionId), true
    )
    .then((response) => response)
    .catch((error) => {
        throw error
      })
  }
}