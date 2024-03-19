import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import { transformCollectionIdResponseToPayload } from './transformers/collectionTransformers'
import { Collection } from '../../domain/models/Collection'
export class CollectionsRepository extends ApiRepository implements ICollectionsRepository {
  private readonly collectionsResourceName: string = 'dataverses'
  private readonly collectionsDefaultOperationType: string = 'get'

  public async getCollection(
    collectionObjectParameter: number | string = 'root'
  ): Promise<Collection> {
    return this.doGet(
      this.buildApiEndpoint(
        this.collectionsResourceName,
        this.collectionsDefaultOperationType,
        collectionObjectParameter
      ),
      true
    )
      .then((response) => transformCollectionIdResponseToPayload(response))
      .catch((error) => {
        throw error
      })
  }
}
