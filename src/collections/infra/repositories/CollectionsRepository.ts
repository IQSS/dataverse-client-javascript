import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import { transformCollectionIdResponseToPayload } from './transformers/collectionTransformers'
export class CollectionsRepository extends ApiRepository implements ICollectionsRepository {
  private readonly collectionsResourceName: string = 'dataverses'

  // NOTE: Used 'disable` for the type below per gPortas.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getCollection(collectionId: any): Promise<any> {
    return this.doGet(this.buildApiEndpoint(this.collectionsResourceName, collectionId), true)
      .then((response) => transformCollectionIdResponseToPayload(response))
      .catch((error) => {
        throw error
      })
  }
}
