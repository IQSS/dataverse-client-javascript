import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import { transformCollectionResponseToCollection } from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ALIAS } from '../../domain/models/Collection'
import { CollectionDTO } from '../../domain/dtos/CollectionDTO'

export interface NewCollectionRequestPayload {
  alias: string
  name: string
  dataverseContacts: NewCollectionContactRequestPayload[]
  dataverseType: string
  metadataBlocks: NewCollectionMetadataBlocksRequestPayload
}

export interface NewCollectionContactRequestPayload {
  contactEmail: string
}

export interface NewCollectionMetadataBlocksRequestPayload {
  metadataBlockNames: string[]
  facetIds: string[]
  inputLevels: NewCollectionInputLevelRequestPayload[]
}

export interface NewCollectionInputLevelRequestPayload {
  datasetFieldTypeName: string
  include: boolean
  required: boolean
}

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
    parentCollectionId: number | string = ROOT_COLLECTION_ALIAS
  ): Promise<number> {
    const dataverseContacts: NewCollectionContactRequestPayload[] = collectionDTO.contacts.map(
      (contact) => ({
        contactEmail: contact
      })
    )

    const inputLevelsRequestBody: NewCollectionInputLevelRequestPayload[] = []
    collectionDTO.inputLevels.forEach((element) => {
      inputLevelsRequestBody.push({
        datasetFieldTypeName: element.datasetFieldName,
        include: element.include,
        required: element.required
      })
    })

    const requestBody: NewCollectionRequestPayload = {
      alias: collectionDTO.alias,
      name: collectionDTO.name,
      dataverseContacts: dataverseContacts,
      dataverseType: collectionDTO.type.toString(),
      metadataBlocks: {
        metadataBlockNames: collectionDTO.metadataBlockNames,
        facetIds: collectionDTO.facetIds,
        inputLevels: inputLevelsRequestBody
      }
    }

    return this.doPost(`/${this.collectionsResourceName}/${parentCollectionId}`, requestBody)
      .then((response) => response.data.data.id)
      .catch((error) => {
        throw error
      })
  }
}
