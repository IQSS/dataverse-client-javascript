import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import { transformCollectionResponseToCollection } from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ALIAS } from '../../domain/models/Collection'
import { CollectionDTO } from '../../domain/dtos/CollectionDTO'

export class CollectionsRepository extends ApiRepository implements ICollectionsRepository {
  private readonly collectionsResourceName: string = 'dataverses'

  public async getCollection(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ALIAS
  ): Promise<Collection> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}`, true, {
      returnOwners: true
    })
      .then((response) => transformCollectionResponseToCollection(response))
      .catch((error) => {
        throw error
      })
  }

  public async createCollection(
    collectionDTO: CollectionDTO,
    parentCollectionId = 'root'
  ): Promise<void> {
    const dataverseContacts = collectionDTO.contacts.map((contact) => ({
      contactEmail: contact
    }))

    const requestBody = {
      alias: collectionDTO.alias,
      name: collectionDTO.name,
      dataverseContacts: dataverseContacts,
      dataverseType: collectionDTO.type.toString()
    }

    return this.doPost(`/${this.collectionsResourceName}/${parentCollectionId}`, requestBody)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
