import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
// import { Collection } from '../../domain/models/Collection'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import { transformCollectionIdResponseToPayload } from './transformers/collectionTransformers'
export class CollectionsRepository extends ApiRepository implements ICollectionsRepository {
  private readonly collectionsResourceName: string = 'dataverses'

  public async getCollection(collectionId: string): Promise<any> {
    return this.doGet(this.buildApiEndpoint(this.collectionsResourceName, collectionId), true)
      .then((response) => transformCollectionIdResponseToPayload(response))
      .catch((error) => {
        throw error
      })
  }
}
