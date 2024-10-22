import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import {
  transformCollectionFacetsResponseToCollectionFacets,
  transformCollectionItemsResponseToCollectionItemSubset,
  transformCollectionResponseToCollection
} from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ALIAS } from '../../domain/models/Collection'
import { CollectionDTO } from '../../domain/dtos/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'
import { transformCollectionUserPermissionsResponseToCollectionUserPermissions } from './transformers/collectionUserPermissionsTransformers'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../../domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '../../domain/models/CollectionItemType'

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

export interface GetCollectionItemsQueryParams {
  q: string
  subtree?: string
  per_page?: number
  start?: number
  type?: string
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
      collectionDTO.inputLevels?.map((inputLevel) => ({
        datasetFieldTypeName: inputLevel.datasetFieldName,
        include: inputLevel.include,
        required: inputLevel.required
      }))

    const requestBody: NewCollectionRequestPayload = {
      alias: collectionDTO.alias,
      name: collectionDTO.name,
      dataverseContacts: dataverseContacts,
      dataverseType: collectionDTO.type,
      ...(collectionDTO.description && {
        description: collectionDTO.description
      }),
      ...(collectionDTO.affiliation && {
        affiliation: collectionDTO.affiliation
      }),
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
    const queryParams: GetCollectionItemsQueryParams = {
      q: '*'
    }
    if (collectionId) {
      queryParams.subtree = collectionId
    }
    if (limit) {
      queryParams.per_page = limit
    }
    if (offset) {
      queryParams.start = offset
    }
    if (collectionSearchCriteria) {
      this.applyCollectionSearchCriteriaToQueryParams(queryParams, collectionSearchCriteria)
    }

    let url = '/search?sort=date&order=desc'

    if (collectionSearchCriteria?.itemTypes) {
      const itemTypesQueryString = collectionSearchCriteria.itemTypes
        .map((itemType: CollectionItemType) => {
          const mappedItemType =
            itemType === CollectionItemType.COLLECTION ? 'dataverse' : itemType.toString()
          return `type=${mappedItemType}`
        })
        .join('&')

      url += `&${itemTypesQueryString}`
    }

    return this.doGet(url, true, queryParams)
      .then((response) => transformCollectionItemsResponseToCollectionItemSubset(response))
      .catch((error) => {
        throw error
      })
  }

  public updateCollection(
    collectionIdOrAlias: string | number,
    updatedCollection: CollectionDTO
  ): Promise<void> {
    throw new Error('Method not implemented ' + collectionIdOrAlias + ' ' + updatedCollection.alias)
  }

  private applyCollectionSearchCriteriaToQueryParams(
    queryParams: GetCollectionItemsQueryParams,
    collectionSearchCriteria: CollectionSearchCriteria
  ) {
    if (collectionSearchCriteria.searchText) {
      queryParams.q = encodeURIComponent(collectionSearchCriteria.searchText)
    }
  }
}
