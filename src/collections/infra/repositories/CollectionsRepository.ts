import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import { transformCollectionResponseToCollection } from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ALIAS } from '../../domain/models/Collection'

export class CollectionsRepository extends ApiRepository implements ICollectionsRepository {
  private readonly collectionsResourceName: string = 'dataverses'
  private readonly collectionsDefaultOperationType: string = 'get'

  public async getCollection(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ALIAS
  ): Promise<Collection> {
    return this.doGet(
      this.buildApiEndpoint(
        this.collectionsResourceName,
        this.collectionsDefaultOperationType,
        collectionIdOrAlias
      ),
      true,
      { returnOwners: true }
    )
      .then((response) => transformCollectionResponseToCollection(response))
      .catch((error) => {
        throw error
      })
  }
}
