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
import {
  CollectionSearchCriteria,
  OrderType,
  SortType
} from '../../domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '../../domain/models/CollectionItemType'
import { CollectionFeaturedItem } from '../../domain/models/CollectionFeaturedItem'
import { transformCollectionFeaturedItemsPayloadToCollectionFeaturedItems } from './transformers/collectionFeaturedItemsTransformer'
import { CollectionFeaturedItemsDTO } from '../../domain/dtos/CollectionFeaturedItemsDTO'
import { ApiConstants } from '../../../core/infra/repositories/ApiConstants'

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
  metadataBlockNames?: string[]
  facetIds?: string[]
  inputLevels?: NewCollectionInputLevelRequestPayload[]
  inheritMetadataBlocksFromParent?: boolean
  inheritFacetsFromParent?: boolean
}

export interface NewCollectionInputLevelRequestPayload {
  datasetFieldTypeName: string
  include: boolean
  required: boolean
}

export enum GetCollectionItemsQueryParams {
  QUERY = 'q',
  SHOW_FACETS = 'show_facets',
  SORT = 'sort',
  ORDER = 'order',
  SUBTREE = 'subtree',
  PER_PAGE = 'per_page',
  START = 'start',
  TYPE = 'type',
  FILTERQUERY = 'fq'
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
      [GetCollectionItemsQueryParams.SORT]: SortType.DATE,
      [GetCollectionItemsQueryParams.ORDER]: OrderType.DESC
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

    const inputLevelsRequestBody: NewCollectionInputLevelRequestPayload[] | undefined =
      collectionDTO.inputLevels?.map((inputLevel) => ({
        datasetFieldTypeName: inputLevel.datasetFieldName,
        include: inputLevel.include,
        required: inputLevel.required
      }))

    const metadataBlocksRequestBody: NewCollectionMetadataBlocksRequestPayload = {}

    if (collectionDTO.inheritMetadataBlocksFromParent) {
      metadataBlocksRequestBody['inheritMetadataBlocksFromParent'] = true
    } else {
      metadataBlocksRequestBody['metadataBlockNames'] = collectionDTO.metadataBlockNames
      metadataBlocksRequestBody['inputLevels'] = inputLevelsRequestBody
    }

    if (collectionDTO.inheritFacetsFromParent) {
      metadataBlocksRequestBody['inheritFacetsFromParent'] = true
    } else {
      metadataBlocksRequestBody['facetIds'] = collectionDTO.facetIds
    }

    // if (collectionDTO.metadataBlockNames && collectionDTO.inputLevels) {
    //   metadataBlocksRequestBody['metadataBlockNames'] = collectionDTO.metadataBlockNames
    //   metadataBlocksRequestBody['inputLevels'] = inputLevelsRequestBody
    // } else {
    //   metadataBlocksRequestBody['inheritMetadataBlocksFromParent'] = true
    // }

    // if (collectionDTO.facetIds) {
    //   metadataBlocksRequestBody['facetIds'] = collectionDTO.facetIds
    // } else {
    //   metadataBlocksRequestBody['inheritFacetsFromParent'] = true
    // }

    return {
      alias: collectionDTO.alias,
      name: collectionDTO.name,
      dataverseContacts: dataverseContacts,
      dataverseType: collectionDTO.type,
      ...(collectionDTO.description && { description: collectionDTO.description }),
      ...(collectionDTO.affiliation && { affiliation: collectionDTO.affiliation }),
      metadataBlocks: metadataBlocksRequestBody
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

    if (collectionSearchCriteria?.sort) {
      queryParams.set(GetCollectionItemsQueryParams.SORT, collectionSearchCriteria.sort)
    }

    if (collectionSearchCriteria?.order) {
      queryParams.set(GetCollectionItemsQueryParams.ORDER, collectionSearchCriteria.order)
    }

    if (collectionSearchCriteria?.filterQueries) {
      collectionSearchCriteria.filterQueries.forEach((filterQuery) => {
        const [filterQueryKey, filterQueryValue] = filterQuery.split(':')

        const filterQueryValueWithQuotes = `"${filterQueryValue}"`

        const filterQueryToSet = `${filterQueryKey}:${filterQueryValueWithQuotes}`

        queryParams.append(GetCollectionItemsQueryParams.FILTERQUERY, filterQueryToSet)
      })
    }
  }

  public async getCollectionFeaturedItems(
    collectionIdOrAlias: number | string
  ): Promise<CollectionFeaturedItem[]> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}/featuredItems`, true)
      .then((response) =>
        transformCollectionFeaturedItemsPayloadToCollectionFeaturedItems(response.data.data)
      )
      .catch((error) => {
        throw error
      })
  }

  public async updateCollectionFeaturedItems(
    collectionIdOrAlias: number | string,
    featuredItemsDTO: CollectionFeaturedItemsDTO
  ): Promise<CollectionFeaturedItem[]> {
    const featuredItemsFormData = this.toFeaturedItemsFormData(featuredItemsDTO)

    return this.doPut(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/featuredItems`,
      featuredItemsFormData,
      undefined,
      ApiConstants.CONTENT_TYPE_MULTIPART_FORM_DATA
    )
      .then((response) =>
        transformCollectionFeaturedItemsPayloadToCollectionFeaturedItems(response.data.data)
      )
      .catch((error) => {
        throw error
      })
  }

  private toFeaturedItemsFormData(featuredItemsDTO: CollectionFeaturedItemsDTO): FormData {
    // This is not really necessary because we are sending displayOrder property anyways, but I wanted to keep the order of the items in the form data
    const orderedFeaturedItemsDTO = featuredItemsDTO.sort((a, b) => a.displayOrder - b.displayOrder)

    const formData = new FormData()

    orderedFeaturedItemsDTO.forEach((item) => {
      const { id, content, displayOrder, file, keepFile } = item
      const fileName = file ? file.name : ''

      formData.append('id', id ? id.toString() : '0')
      formData.append('content', content)
      formData.append('displayOrder', displayOrder.toString())
      formData.append('keepFile', keepFile.toString())
      formData.append('fileName', fileName)
      if (file) {
        formData.append('file', file)
      }
    })

    return formData
  }

  public async deleteCollectionFeaturedItems(collectionIdOrAlias: number | string): Promise<void> {
    return this.doDelete(`/${this.collectionsResourceName}/${collectionIdOrAlias}/featuredItems`)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
