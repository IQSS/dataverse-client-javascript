import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ICollectionsRepository } from '../../domain/repositories/ICollectionsRepository'
import {
  transformCollectionFacetsResponseToCollectionFacets,
  transformCollectionItemsResponseToCollectionItemSubset,
  transformCollectionLinksResponseToCollectionLinks,
  transformCollectionResponseToCollection,
  transformMyDataResponseToCollectionItemSubset
} from './transformers/collectionTransformers'
import { Collection, ROOT_COLLECTION_ID } from '../../domain/models/Collection'
import { CollectionDTO } from '../../domain/dtos/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'
import { transformCollectionUserPermissionsResponseToCollectionUserPermissions } from './transformers/collectionUserPermissionsTransformers'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'
import { MyDataCollectionItemSubset } from '../../domain/models/MyDataCollectionItemSubset'
import {
  CollectionSearchCriteria,
  OrderType,
  SortType
} from '../../domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '../../domain/models/CollectionItemType'
import {
  FeaturedItem,
  DvObjectFeaturedItem,
  FeaturedItemType
} from '../../domain/models/FeaturedItem'
import {
  domainTypeToApiType,
  transformFeaturedItemsPayloadToFeaturedItems
} from './transformers/featuredItemsTransformer'
import {
  FeaturedItemsDTO,
  CustomFeaturedItemDTO,
  DvObjectFeaturedItemDTO
} from '../../domain/dtos/FeaturedItemsDTO'
import { ApiConstants } from '../../../core/infra/repositories/ApiConstants'
import { PublicationStatus } from '../../../core/domain/models/PublicationStatus'
import { ReadError } from '../../../core/domain/repositories/ReadError'
import { CollectionLinks } from '../../domain/models/CollectionLinks'
import { CollectionSummary } from '../../domain/models/CollectionSummary'
import { AllowedStorageDrivers } from '../../domain/models/AllowedStorageDrivers'
import { StorageDriver } from '../../../core/domain/models/StorageDriver'
import { LinkingObjectType } from '../../domain/useCases/GetCollectionsForLinking'

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
  FILTERQUERY = 'fq',
  SHOW_TYPE_COUNTS = 'show_type_counts',
  SEARCH_SERVICE_NAME = 'search_service'
}

export enum GetMyDataCollectionItemsQueryParams {
  SEARCH_TEXT = 'mydata_search_term',
  PER_PAGE = 'per_page',
  SELECTED_PAGE = 'selected_page',
  ROLE_ID = 'role_ids',
  TYPE = 'dvobject_types',
  PUBLISHED_STATES = 'published_states',
  USER_IDENTIFIER = 'userIdentifier'
}

export class CollectionsRepository extends ApiRepository implements ICollectionsRepository {
  private readonly collectionsResourceName: string = 'dataverses'
  public async getCollection(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<Collection> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}`, true, {
      returnOwners: true,
      returnChildCount: true
    })
      .then((response) => transformCollectionResponseToCollection(response))
      .catch((error) => {
        throw error
      })
  }

  public async getCollectionStorageDriver(
    collectionIdOrAlias: number | string,
    getEffective = true
  ): Promise<StorageDriver> {
    return this.doGet(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/storageDriver`,
      true,
      {
        getEffective
      }
    )
      .then((response) => response.data.data as StorageDriver)
      .catch((error) => {
        throw error
      })
  }

  public async setCollectionStorageDriver(
    collectionIdOrAlias: number | string,
    driverLabel: string
  ): Promise<string> {
    return this.doPut(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/storageDriver`,
      driverLabel,
      undefined,
      ApiConstants.CONTENT_TYPE_TEXT_PLAIN
    )
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error
      })
  }

  public async deleteCollectionStorageDriver(
    collectionIdOrAlias: number | string
  ): Promise<string> {
    return this.doDelete(`/${this.collectionsResourceName}/${collectionIdOrAlias}/storageDriver`)
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error
      })
  }

  public async getAllowedCollectionStorageDrivers(
    collectionIdOrAlias: number | string
  ): Promise<AllowedStorageDrivers> {
    return this.doGet(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/allowedStorageDrivers`,
      true
    )
      .then((response) => response.data.data as AllowedStorageDrivers)
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

  public async deleteCollection(collectionIdOrAlias: number | string): Promise<void> {
    return this.doDelete(`/${this.collectionsResourceName}/${collectionIdOrAlias}`)
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
    collectionSearchCriteria?: CollectionSearchCriteria,
    searchServiceName?: string,
    showTypeCounts?: boolean
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

    if (showTypeCounts) {
      queryParams.set(GetCollectionItemsQueryParams.SHOW_TYPE_COUNTS, 'true')
    }

    if (searchServiceName) {
      queryParams.set(GetCollectionItemsQueryParams.SEARCH_SERVICE_NAME, searchServiceName)
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
    updatedCollection: Partial<CollectionDTO>
  ): Promise<void> {
    const requestBody = this.createUpdateRequestBody(updatedCollection)

    return this.doPut(`/${this.collectionsResourceName}/${collectionIdOrAlias}`, requestBody)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getMyDataCollectionItems(
    roleIds: number[],
    collectionItemTypes: CollectionItemType[],
    publicationStatuses: PublicationStatus[],
    limit?: number,
    selectedPage?: number,
    searchText?: string,
    userIdentifier?: string
  ): Promise<MyDataCollectionItemSubset> {
    const queryParams = new URLSearchParams()

    if (limit) {
      queryParams.set(GetMyDataCollectionItemsQueryParams.PER_PAGE, limit.toString())
    }

    if (selectedPage) {
      queryParams.set(GetMyDataCollectionItemsQueryParams.SELECTED_PAGE, selectedPage.toString())
    }

    if (searchText) {
      queryParams.set(GetMyDataCollectionItemsQueryParams.SEARCH_TEXT, searchText)
    }

    roleIds.forEach((roleId) => {
      queryParams.append(GetMyDataCollectionItemsQueryParams.ROLE_ID, roleId.toString())
    })
    if (userIdentifier) {
      queryParams.set(GetMyDataCollectionItemsQueryParams.USER_IDENTIFIER, userIdentifier)
    }

    collectionItemTypes.forEach((itemType) => {
      let mappedItemType: string

      switch (itemType) {
        case CollectionItemType.COLLECTION:
          mappedItemType = 'Dataverse'
          break
        case CollectionItemType.DATASET:
          mappedItemType = 'Dataset'
          break
        case CollectionItemType.FILE:
          mappedItemType = 'DataFile'
          break
      }
      queryParams.append(GetMyDataCollectionItemsQueryParams.TYPE, mappedItemType)
    })

    publicationStatuses.forEach((publicationStatus) => {
      queryParams.append(
        GetMyDataCollectionItemsQueryParams.PUBLISHED_STATES,
        publicationStatus.toString()
      )
    })
    const result = await this.doGet('/mydata/retrieve', true, queryParams)
      .then((response) => {
        if (response.data.success !== true) {
          throw new ReadError(response.data.error_message)
        }
        return transformMyDataResponseToCollectionItemSubset(response)
      })
      .catch((error) => {
        throw error
      })

    return result
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

    const metadataBlocksRequestBody: NewCollectionMetadataBlocksRequestPayload = {
      ...(!collectionDTO.inheritMetadataBlocksFromParent && {
        metadataBlockNames: collectionDTO.metadataBlockNames,
        inputLevels: inputLevelsRequestBody
      }),
      ...(!collectionDTO.inheritFacetsFromParent && {
        facetIds: collectionDTO.facetIds
      }),
      inheritMetadataBlocksFromParent: collectionDTO.inheritMetadataBlocksFromParent,
      inheritFacetsFromParent: collectionDTO.inheritFacetsFromParent
    }

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

  private createUpdateRequestBody(
    collectionDTO: Partial<CollectionDTO>
  ): Partial<NewCollectionRequestPayload> {
    const dataverseContacts: NewCollectionContactRequestPayload[] | undefined =
      collectionDTO.contacts?.map((contact) => ({
        contactEmail: contact
      }))
    const inputLevelsRequestBody: NewCollectionInputLevelRequestPayload[] | undefined =
      collectionDTO.inputLevels?.map((inputLevel) => ({
        datasetFieldTypeName: inputLevel.datasetFieldName,
        include: inputLevel.include,
        required: inputLevel.required
      }))
    let metadataBlocksRequestBody: Partial<NewCollectionMetadataBlocksRequestPayload> | undefined

    const hasMetadataBlocksData =
      collectionDTO.metadataBlockNames !== undefined ||
      collectionDTO.facetIds !== undefined ||
      collectionDTO.inputLevels !== undefined ||
      collectionDTO.inheritMetadataBlocksFromParent !== undefined ||
      collectionDTO.inheritFacetsFromParent !== undefined

    if (hasMetadataBlocksData) {
      metadataBlocksRequestBody = {}
      if (collectionDTO.inheritMetadataBlocksFromParent !== true) {
        if (collectionDTO.metadataBlockNames !== undefined) {
          metadataBlocksRequestBody.metadataBlockNames = collectionDTO.metadataBlockNames
        }
        if (inputLevelsRequestBody !== undefined) {
          metadataBlocksRequestBody.inputLevels = inputLevelsRequestBody
        }
      }
      if (collectionDTO.inheritFacetsFromParent !== true) {
        if (collectionDTO.facetIds !== undefined) {
          metadataBlocksRequestBody.facetIds = collectionDTO.facetIds
        }
      }
      if (collectionDTO.inheritMetadataBlocksFromParent !== undefined) {
        metadataBlocksRequestBody.inheritMetadataBlocksFromParent =
          collectionDTO.inheritMetadataBlocksFromParent
      }
      if (collectionDTO.inheritFacetsFromParent !== undefined) {
        metadataBlocksRequestBody.inheritFacetsFromParent = collectionDTO.inheritFacetsFromParent
      }
    }

    // Build the final request body, only including defined fields
    const requestBody: Partial<NewCollectionRequestPayload> = {}

    if (collectionDTO.alias !== undefined) {
      requestBody.alias = collectionDTO.alias
    }

    if (collectionDTO.name !== undefined) {
      requestBody.name = collectionDTO.name
    }

    if (dataverseContacts !== undefined) {
      requestBody.dataverseContacts = dataverseContacts
    }

    if (collectionDTO.type !== undefined) {
      requestBody.dataverseType = collectionDTO.type
    }

    if (collectionDTO.description !== undefined) {
      requestBody.description = collectionDTO.description
    }

    if (collectionDTO.affiliation !== undefined) {
      requestBody.affiliation = collectionDTO.affiliation
    }

    if (metadataBlocksRequestBody !== undefined) {
      requestBody.metadataBlocks = metadataBlocksRequestBody
    }

    return requestBody
  }

  private applyCollectionSearchCriteriaToQueryParams(
    queryParams: URLSearchParams,
    collectionSearchCriteria: CollectionSearchCriteria
  ) {
    if (collectionSearchCriteria.searchText) {
      queryParams.set(GetCollectionItemsQueryParams.QUERY, collectionSearchCriteria.searchText)
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
        const idx = filterQuery.indexOf(':')
        if (idx === -1) return // Invalid filter query, skip it

        const filterQueryKey = filterQuery.substring(0, idx).trim()
        const filterQueryValue = filterQuery.substring(idx + 1).trim()

        const filterQueryValueWithQuotes = `"${filterQueryValue}"`
        const filterQueryToSet = `${filterQueryKey}:${filterQueryValueWithQuotes}`

        queryParams.append(GetCollectionItemsQueryParams.FILTERQUERY, filterQueryToSet)
      })
    }
  }

  public async getCollectionFeaturedItems(
    collectionIdOrAlias: number | string
  ): Promise<FeaturedItem[]> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}/featuredItems`, true)
      .then((response) => transformFeaturedItemsPayloadToFeaturedItems(response.data.data))
      .catch((error) => {
        throw error
      })
  }

  public async updateCollectionFeaturedItems(
    collectionIdOrAlias: number | string,
    featuredItemsDTO: FeaturedItemsDTO
  ): Promise<FeaturedItem[]> {
    const featuredItemsFormData = this.toFeaturedItemsFormData(featuredItemsDTO)

    return this.doPut(
      `/${this.collectionsResourceName}/${collectionIdOrAlias}/featuredItems`,
      featuredItemsFormData,
      undefined,
      ApiConstants.CONTENT_TYPE_MULTIPART_FORM_DATA
    )
      .then((response) => transformFeaturedItemsPayloadToFeaturedItems(response.data.data))
      .catch((error) => {
        throw error
      })
  }

  private toFeaturedItemsFormData(featuredItemsDTO: FeaturedItemsDTO): FormData {
    // This is not really necessary because we are sending displayOrder property anyways, but I wanted to keep the order of the items in the form data
    const orderedFeaturedItemsDTO = featuredItemsDTO.sort((a, b) => a.displayOrder - b.displayOrder)

    const formData = new FormData()

    orderedFeaturedItemsDTO.forEach((item: CustomFeaturedItemDTO | DvObjectFeaturedItemDTO) => {
      formData.append('id', item.id !== undefined ? item.id.toString() : '0')
      formData.append('displayOrder', item.displayOrder.toString())

      if (item.type === FeaturedItemType.CUSTOM) {
        // CustomFeaturedItemDTO
        formData.append('type', item.type)
        formData.append('content', item.content)
        formData.append('keepFile', item.keepFile.toString())
        formData.append('fileName', item.file ? item.file.name : '')
        if (item.file) {
          formData.append('file', item.file)
        }

        // We still need to append dvObjectIdentifier as it is expected by the backend even empty
        formData.append('dvObjectIdentifier', '')
      } else {
        // DvObjectFeaturedItemDTO
        formData.append('type', domainTypeToApiType[item.type as DvObjectFeaturedItem['type']])
        formData.append('dvObjectIdentifier', item.dvObjectIdentifier)

        // We still need to append content, keepFile, and fileName as they are expected by the backend even empty
        formData.append('content', '')
        formData.append('keepFile', '')
        formData.append('fileName', '')
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

  public async deleteCollectionFeaturedItem(featuredItemId: number): Promise<void> {
    return this.doDelete(`/dataverseFeaturedItems/${featuredItemId}`)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
  public async linkCollection(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void> {
    return this.doPut(
      `/dataverses/${linkedCollectionIdOrAlias}/link/${linkingCollectionIdOrAlias}`,
      {} // No data is needed for this operation
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
  public async unlinkCollection(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void> {
    return this.doDelete(
      `/dataverses/${linkedCollectionIdOrAlias}/deleteLink/${linkingCollectionIdOrAlias}`
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
  public async getCollectionLinks(collectionIdOrAlias: number | string): Promise<CollectionLinks> {
    return this.doGet(`/${this.collectionsResourceName}/${collectionIdOrAlias}/links`, true)
      .then((response) => {
        return transformCollectionLinksResponseToCollectionLinks(response)
      })
      .catch((error) => {
        throw error
      })
  }

  public async getCollectionsForLinking(
    objectType: LinkingObjectType,
    id: number | string,
    searchTerm: string,
    alreadyLinked: boolean
  ): Promise<CollectionSummary[]> {
    let path: string
    const queryParams = new URLSearchParams()
    if (objectType === 'collection') {
      path = `/${this.collectionsResourceName}/${id}/dataverse/linkingDataverses`
    } else {
      path = `/${this.collectionsResourceName}/:persistentId/dataset/linkingDataverses`
      queryParams.set('persistentId', String(id))
    }

    if (searchTerm) {
      queryParams.set('searchTerm', searchTerm)
    }

    if (alreadyLinked) {
      queryParams.set('alreadyLinking', 'true')
    }

    return this.doGet(path, true, queryParams)
      .then((response) => {
        const payload = response.data.data as {
          id: number
          alias: string
          name: string
        }[]

        return payload.map((item) => ({
          id: item.id,
          alias: item.alias,
          displayName: item.name
        }))
      })
      .catch((error) => {
        throw error
      })
  }
}
