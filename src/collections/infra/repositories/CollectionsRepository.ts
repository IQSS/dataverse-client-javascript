import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import {
  transformCollectionItemsResponseToCollectionItemSubset,
  transformCollectionResponseToCollection
} from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ALIAS } from '../../domain/models/Collection'
import { CollectionDTO } from '../../domain/dtos/CollectionDTO'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'

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

export interface GetCollectionItemsQueryParams {
  subtree?: string
  per_page?: number
  start?: number
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

    const inputLevelsRequestBody: NewCollectionInputLevelRequestPayload[] =
      collectionDTO.inputLevels.map((inputLevel) => ({
        datasetFieldTypeName: inputLevel.datasetFieldName,
        include: inputLevel.include,
        required: inputLevel.required
      }))

    const requestBody: NewCollectionRequestPayload = {
      alias: collectionDTO.alias,
      name: collectionDTO.name,
      dataverseContacts: dataverseContacts,
      dataverseType: collectionDTO.type,
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

  public async getCollectionFacets(collectionIdOrAlias: string | number): Promise<string[]> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}/facets`, true)
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async getCollectionItems(
    collectionId?: string,
    limit?: number,
    offset?: number
  ): Promise<CollectionItemSubset> {
    const queryParams: GetCollectionItemsQueryParams = {}
    if (collectionId !== undefined) {
      queryParams.subtree = collectionId
    }
    if (limit !== undefined) {
      queryParams.per_page = limit
    }
    if (offset !== undefined) {
      queryParams.start = offset
    }
    return this.doGet('/search?q=*&type=dataset&type=file&sort=date&order=desc', true, queryParams)
      .then((response) => transformCollectionItemsResponseToCollectionItemSubset(response))
      .catch((error) => {
        throw error
      })
  }
}
