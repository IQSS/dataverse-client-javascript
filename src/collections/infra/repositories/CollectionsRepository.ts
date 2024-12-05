import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import {
  transformCollectionFacetsResponseToCollectionFacets,
  transformCollectionItemsResponseToCollectionItemSubset,
  transformCollectionResponseToCollection
} from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ID } from '../../domain/models/Collection'
import { CollectionDTO } from '../../domain/dtos/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'
import { transformCollectionUserPermissionsResponseToCollectionUserPermissions } from './transformers/collectionUserPermissionsTransformers'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../../domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '../../domain/models/CollectionItemType'
import { GetCollectionItemsQueryParams } from '../../domain/models/GetCollectionItemsQueryParams'

export interface NewCollectionRequestPayload {
  alias: string
  name: string
  dataverseContacts: NewCollectionContactRequestPayload[]
  dataverseType: string
  description?: string
  affiliation?: string
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
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
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
    parentCollectionId: number | string = ROOT_COLLECTION_ID
  ): Promise<number> {
    const requestBody = this.createCreateOrUpdateRequestBody(collectionDTO)

    return this.doPost(`/${this.collectionsResourceName}/${parentCollectionId}`, requestBody)
      .then((response) => response.data.data.id)
      .catch((error) => {
        throw error
      })
  }

  public async getCollectionFacets(
    collectionIdOrAlias: string | number
  ): Promise<CollectionFacet[]> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}/facets`, true, {
      returnDetails: true
    })
      .then((response) => transformCollectionFacetsResponseToCollectionFacets(response))
      .catch((error) => {
        throw error
      })
  }
  public async publishCollection(collectionIdOrAlias: string | number): Promise<void> {
    return this.doPost(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/actions/:publish`,
      {}
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getCollectionUserPermissions(
    collectionIdOrAlias: number | string
  ): Promise<CollectionUserPermissions> {
    return this.doGet(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/userPermissions`,
      true
    )
      .then((response) =>
        transformCollectionUserPermissionsResponseToCollectionUserPermissions(response)
      )
      .catch((error) => {
        throw error
      })
  }

  public async getCollectionItems(
    collectionId?: string,
    limit?: number,
    offset?: number,
    collectionSearchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    const queryParams = new URLSearchParams({
      [GetCollectionItemsQueryParams.QUERY]: '*',
      [GetCollectionItemsQueryParams.SHOW_FACETS]: 'true',
      [GetCollectionItemsQueryParams.SORT]: 'date',
      [GetCollectionItemsQueryParams.ORDER]: 'desc'
    })

    if (collectionId) {
      queryParams.set(GetCollectionItemsQueryParams.SUBTREE, collectionId)
    }

    if (limit) {
      queryParams.set(GetCollectionItemsQueryParams.PER_PAGE, limit.toString())
    }

    if (offset) {
      queryParams.set(GetCollectionItemsQueryParams.START, offset.toString())
    }

    if (collectionSearchCriteria) {
      this.applyCollectionSearchCriteriaToQueryParams(queryParams, collectionSearchCriteria)
    }

    return this.doGet('/search', true, queryParams)
      .then((response) => transformCollectionItemsResponseToCollectionItemSubset(response))
      .catch((error) => {
        throw error
      })
  }

  public async updateCollection(
    collectionIdOrAlias: string | number,
    updatedCollection: CollectionDTO
  ): Promise<void> {
    const requestBody = this.createCreateOrUpdateRequestBody(updatedCollection)

    return this.doPut(`/${this.collectionsResourceName}/${collectionIdOrAlias}`, requestBody)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  private createCreateOrUpdateRequestBody(
    collectionDTO: CollectionDTO
  ): NewCollectionRequestPayload {
    const dataverseContacts: NewCollectionContactRequestPayload[] = collectionDTO.contacts.map(
      (contact) => ({
        contactEmail: contact
      })
    )

    const inputLevelsRequestBody: NewCollectionInputLevelRequestPayload[] =
      collectionDTO.inputLevels?.map((inputLevel) => ({
        datasetFieldTypeName: inputLevel.datasetFieldName,
        include: inputLevel.include,
        required: inputLevel.required
      }))

    return {
      alias: collectionDTO.alias,
      name: collectionDTO.name,
      dataverseContacts: dataverseContacts,
      dataverseType: collectionDTO.type,
      ...(collectionDTO.description && { description: collectionDTO.description }),
      ...(collectionDTO.affiliation && { affiliation: collectionDTO.affiliation }),
      metadataBlocks: {
        metadataBlockNames: collectionDTO.metadataBlockNames,
        facetIds: collectionDTO.facetIds,
        inputLevels: inputLevelsRequestBody
      }
    }
  }

  private applyCollectionSearchCriteriaToQueryParams(
    queryParams: URLSearchParams,
    collectionSearchCriteria: CollectionSearchCriteria
  ) {
    if (collectionSearchCriteria.searchText) {
      queryParams.set(
        GetCollectionItemsQueryParams.QUERY,
        encodeURIComponent(collectionSearchCriteria.searchText)
      )
    }

    if (collectionSearchCriteria?.itemTypes) {
      collectionSearchCriteria.itemTypes.forEach((itemType) => {
        const mappedItemType = itemType === CollectionItemType.COLLECTION ? 'dataverse' : itemType

        queryParams.append(GetCollectionItemsQueryParams.TYPE, mappedItemType)
      })
    }
  }
}
