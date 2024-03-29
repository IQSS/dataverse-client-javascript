import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import { transformCollectionResponseToCollection } from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ALIAS } from '../../domain/models/Collection'
import { MetadataBlock } from '../../../metadataBlocks'
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

  public async getCollectionMetadataBlocks(
    collectionIdOrAlias: string | number,
    onlyDisplayedOnCreate: boolean
  ): Promise<MetadataBlock[]> {
    return this.doGet(
      this.buildApiEndpoint(
        this.collectionsResourceName,
        this.collectionsDefaultOperationType,
        collectionIdOrAlias
      ),
      true,
      {
        onlyDisplayedOnCreate: onlyDisplayedOnCreate,
        returnDatasetFieldTypes: true
      }
    )
      .then(
        (
          response //TODO transform
        ) => response.data
      )
      .catch((error) => {
        throw error
      })
  }
}
