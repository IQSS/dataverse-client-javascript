import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository'
import { Dataset, VersionUpdateType } from '../../domain/models/Dataset'
import {
  transformVersionResponseToDataset,
  transformDatasetModelToUpdateDatasetRequestPayload
} from './transformers/datasetTransformers'
import { DatasetUserPermissions } from '../../domain/models/DatasetUserPermissions'
import { transformDatasetUserPermissionsResponseToDatasetUserPermissions } from './transformers/datasetUserPermissionsTransformers'
import { DatasetLock } from '../../domain/models/DatasetLock'
import { CreatedDatasetIdentifiers } from '../../domain/models/CreatedDatasetIdentifiers'
import { DatasetPreviewSubset } from '../../domain/models/DatasetPreviewSubset'
import { DatasetDTO } from '../../domain/dtos/DatasetDTO'
import { DatasetDeaccessionDTO } from '../../domain/dtos/DatasetDeaccessionDTO'
import { MetadataBlock } from '../../../metadataBlocks'
import { transformDatasetModelToNewDatasetRequestPayload } from './transformers/datasetTransformers'
import { transformDatasetLocksResponseToDatasetLocks } from './transformers/datasetLocksTransformers'
import { transformDatasetPreviewsResponseToDatasetPreviewSubset } from './transformers/datasetPreviewsTransformers'
import { DatasetVersionDiff } from '../../domain/models/DatasetVersionDiff'
import { transformDatasetVersionDiffResponseToDatasetVersionDiff } from './transformers/datasetVersionDiffTransformers'
import { DatasetDownloadCount } from '../../domain/models/DatasetDownloadCount'
import { DatasetVersionSummarySubset } from '../../domain/models/DatasetVersionSummaryInfo'
import { DatasetLinkedCollection } from '../../domain/models/DatasetLinkedCollection'
import { CitationFormat } from '../../domain/models/CitationFormat'
import { transformDatasetLinkedCollectionsResponseToDatasetLinkedCollection } from './transformers/datasetLinkedCollectionsTransformers'
import { FormattedCitation } from '../../domain/models/FormattedCitation'
import { DatasetType } from '../../domain/models/DatasetType'
import { TermsOfAccess } from '../../domain/models/Dataset'
import { DatasetNotNumberedVersion } from '../../domain/models/DatasetNotNumberedVersion'
import { transformTermsOfAccessToUpdatePayload } from './transformers/termsOfAccessTransformers'
import { DatasetLicenseUpdateRequest } from '../../domain/dtos/DatasetLicenseUpdateRequest'
import { DatasetTypeDTO } from '../../domain/dtos/DatasetTypeDTO'
import { StorageDriver } from '../../../core/domain/models/StorageDriver'
import { DatasetUploadLimits } from '../../domain/models/DatasetUploadLimits'
import { DatasetReview } from '../../domain/models/DatasetReview'
import { transformDatasetReviewsResponseToDatasetReviews } from './transformers/datasetReviewTransformers'
import { ExportedDatasetMetadata } from '../../domain/models/ExportedDatasetMetadata'

export interface GetAllDatasetPreviewsQueryParams {
  per_page?: number
  start?: number
  subtree?: string
}

export class DatasetsRepository extends ApiRepository implements IDatasetsRepository {
  private readonly datasetsResourceName: string = 'datasets'

  public async getDatasetSummaryFieldNames(): Promise<string[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, 'summaryFieldNames'))
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async getPrivateUrlDataset(token: string, keepRawFields: boolean): Promise<Dataset> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `privateUrlDatasetVersion/${token}`),
      false,
      {
        returnOwners: true
      }
    )
      .then((response) => transformVersionResponseToDataset(response, keepRawFields))
      .catch((error) => {
        throw error
      })
  }

  public async getDataset(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    keepRawFields: boolean
  ): Promise<Dataset> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}`, datasetId),
      true,
      {
        includeDeaccessioned: includeDeaccessioned,
        excludeFiles: true,
        returnOwners: true
      }
    )
      .then((response) => transformVersionResponseToDataset(response, keepRawFields))
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetCitation(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean
  ): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(
        this.datasetsResourceName,
        `versions/${datasetVersionId}/citation`,
        datasetId
      ),
      true,
      { includeDeaccessioned: includeDeaccessioned }
    )
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetCitationInOtherFormats(
    datasetId: number | string,
    datasetVersionId: string | 'LATEST' = 'LATEST',
    format: CitationFormat,
    includeDeaccessioned = false
  ): Promise<FormattedCitation> {
    const endpoint = this.buildApiEndpoint(
      this.datasetsResourceName,
      `versions/${datasetVersionId}/citation/${format}`,
      datasetId
    )
    const response = await this.doGet(endpoint, true, { includeDeaccessioned })

    const contentType = response.headers['content-type']
    let content: string
    if (contentType && contentType.includes('application/json')) {
      content = JSON.stringify(response.data)
    } else {
      content = response.data
    }

    return {
      content,
      contentType
    }
  }

  public async exportDatasetMetadata(
    datasetId: number | string,
    exporter: string,
    version?: DatasetNotNumberedVersion.LATEST_PUBLISHED | DatasetNotNumberedVersion.DRAFT
  ): Promise<ExportedDatasetMetadata> {
    const persistentId =
      typeof datasetId === 'number'
        ? (
            await this.getDataset(
              datasetId,
              version ?? DatasetNotNumberedVersion.LATEST_PUBLISHED,
              false,
              false
            )
          ).persistentId
        : datasetId

    const response = await this.doGet('/datasets/export', true, {
      exporter,
      persistentId,
      ...(version && { version })
    })

    const contentType = String(response.headers['content-type'] ?? '')
    const content =
      typeof response.data === 'string' ? response.data : JSON.stringify(response.data)

    return {
      content,
      contentType
    }
  }

  public async getPrivateUrlDatasetCitation(token: string): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `privateUrlDatasetVersion/${token}/citation`)
    )
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetUserPermissions(
    datasetId: string | number
  ): Promise<DatasetUserPermissions> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `userPermissions`, datasetId),
      true
    )
      .then((response) => transformDatasetUserPermissionsResponseToDatasetUserPermissions(response))
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetLocks(datasetId: string | number): Promise<DatasetLock[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, `locks`, datasetId), true)
      .then((response) => transformDatasetLocksResponseToDatasetLocks(response))
      .catch((error) => {
        throw error
      })
  }

  public async getAllDatasetPreviews(
    limit?: number,
    offset?: number,
    collectionId?: string
  ): Promise<DatasetPreviewSubset> {
    const queryParams: GetAllDatasetPreviewsQueryParams = {}
    if (limit !== undefined) {
      queryParams.per_page = limit
    }
    if (offset !== undefined) {
      queryParams.start = offset
    }
    if (collectionId !== undefined) {
      queryParams.subtree = collectionId
    }
    return this.doGet('/search?q=*&type=dataset&sort=date&order=desc', true, queryParams)
      .then((response) => transformDatasetPreviewsResponseToDatasetPreviewSubset(response))
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetVersionDiff(
    datasetId: string | number,
    oldVersionId: string,
    newVersionId: string,
    includeDeaccessioned: boolean
  ): Promise<DatasetVersionDiff> {
    return this.doGet(
      this.buildApiEndpoint(
        this.datasetsResourceName,
        `versions/${oldVersionId}/compare/${newVersionId}`,
        datasetId
      ),
      true,
      {
        includeDeaccessioned
      }
    )
      .then((response) => transformDatasetVersionDiffResponseToDatasetVersionDiff(response))
      .catch((error) => {
        throw error
      })
  }

  public async createDataset(
    newDataset: DatasetDTO,
    datasetMetadataBlocks: MetadataBlock[],
    collectionId: string,
    datasetType?: string
  ): Promise<CreatedDatasetIdentifiers> {
    return this.doPost(
      `/dataverses/${collectionId}/datasets`,
      transformDatasetModelToNewDatasetRequestPayload(
        newDataset,
        datasetMetadataBlocks,
        datasetType
      )
    )
      .then((response) => {
        const responseData = response.data.data
        return {
          persistentId: responseData.persistentId,
          numericId: responseData.id
        }
      })
      .catch((error) => {
        throw error
      })
  }

  public async publishDataset(
    datasetId: string | number,
    versionUpdateType: VersionUpdateType
  ): Promise<void> {
    return this.doPost(
      this.buildApiEndpoint(this.datasetsResourceName, `actions/:publish`, datasetId),
      {},
      {
        type: versionUpdateType
      }
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async updateDataset(
    datasetId: string | number,
    dataset: DatasetDTO,
    datasetMetadataBlocks: MetadataBlock[],
    sourceLastUpdateTime?: string
  ): Promise<void> {
    return this.doPut(
      this.buildApiEndpoint(this.datasetsResourceName, `editMetadata`, datasetId),
      transformDatasetModelToUpdateDatasetRequestPayload(dataset, datasetMetadataBlocks),
      {
        replace: true,
        ...(sourceLastUpdateTime && { sourceLastUpdateTime })
      }
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async deaccessionDataset(
    datasetId: string | number,
    datasetVersionId: string,
    deaccessionDTO: DatasetDeaccessionDTO
  ): Promise<void> {
    return this.doPost(
      this.buildApiEndpoint(
        this.datasetsResourceName,
        `versions/${datasetVersionId}/deaccession`,
        datasetId
      ),
      deaccessionDTO
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetDownloadCount(
    datasetId: number | string,
    includeMDC?: boolean
  ): Promise<DatasetDownloadCount> {
    const queryParams = includeMDC !== undefined ? { includeMDC } : {}

    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `download/count`, datasetId),
      true,
      queryParams
    )
      .then((response) => response.data)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetVersionsSummaries(
    datasetId: string | number,
    limit?: number,
    offset?: number
  ): Promise<DatasetVersionSummarySubset> {
    const queryParams = new URLSearchParams()

    if (limit) {
      queryParams.set('limit', limit.toString())
    }

    if (offset) {
      queryParams.set('offset', offset.toString())
    }

    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, 'versions/compareSummary', datasetId),
      true,
      queryParams
    )
      .then((response) => ({
        summaries: response.data.data,
        totalCount: response.data.totalCount
      }))
      .catch((error) => {
        throw error
      })
  }

  public async deleteDatasetDraft(datasetId: string | number): Promise<void> {
    return this.doDelete(
      this.buildApiEndpoint(this.datasetsResourceName, 'versions/:draft', datasetId)
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async linkDataset(
    datasetId: number | string,
    collectionIdOrAlias: number | string
  ): Promise<void> {
    const endpoint = this.buildApiEndpoint(
      this.datasetsResourceName,
      `link/${collectionIdOrAlias}`,
      datasetId
    )
    return this.doPut(endpoint, {})
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async unlinkDataset(
    datasetId: number | string,
    collectionIdOrAlias: number | string
  ): Promise<void> {
    const endpoint = this.buildApiEndpoint(
      this.datasetsResourceName,
      `deleteLink/${collectionIdOrAlias}`,
      datasetId
    )
    return this.doDelete(endpoint)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetLinkedCollections(
    datasetId: number | string
  ): Promise<DatasetLinkedCollection[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, 'links', datasetId), true)
      .then((response) =>
        transformDatasetLinkedCollectionsResponseToDatasetLinkedCollection(response.data.data)
      )
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetAvailableCategories(datasetId: number | string): Promise<string[]> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, 'availableFileCategories', datasetId),
      true
    )
      .then((response) => response.data.data as string[])
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetAvailableDatasetTypes(): Promise<DatasetType[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, 'datasetTypes'))
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetAvailableDatasetType(
    datasetTypeId: number | string
  ): Promise<DatasetType> {
    const endpoint = this.buildApiEndpoint(
      this.datasetsResourceName,
      'datasetTypes/' + datasetTypeId
    )
    return this.doGet(endpoint)
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async addDatasetType(datasetType: DatasetTypeDTO): Promise<DatasetType> {
    return this.doPost(
      this.buildApiEndpoint(this.datasetsResourceName, 'datasetTypes'),
      datasetType
    )
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async linkDatasetTypeWithMetadataBlocks(
    datasetTypeId: number | string,
    metadataBlocks: string[]
  ): Promise<void> {
    return this.doPut(
      this.buildApiEndpoint(this.datasetsResourceName, 'datasetTypes/' + datasetTypeId),
      metadataBlocks
    )
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async setAvailableLicensesForDatasetType(
    datasetTypeId: number | string,
    licenses: string[]
  ): Promise<void> {
    return this.doPut(
      this.buildApiEndpoint(
        this.datasetsResourceName,
        'datasetTypes/' + datasetTypeId + '/licenses'
      ),
      licenses
    )
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async deleteDatasetType(datasetTypeId: number): Promise<void> {
    return this.doDelete(
      this.buildApiEndpoint(this.datasetsResourceName, 'datasetTypes/' + datasetTypeId)
    )
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }

  public async updateTermsOfAccess(
    datasetId: number | string,
    termsOfAccess: TermsOfAccess
  ): Promise<void> {
    return this.doPut(
      this.buildApiEndpoint(this.datasetsResourceName, 'access', datasetId),
      transformTermsOfAccessToUpdatePayload(termsOfAccess)
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async updateDatasetLicense(
    datasetId: number | string,
    payload: DatasetLicenseUpdateRequest
  ): Promise<void> {
    return this.doPut(
      this.buildApiEndpoint(this.datasetsResourceName, 'license', datasetId),
      payload
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetStorageDriver(datasetId: number | string): Promise<StorageDriver> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, 'storageDriver', datasetId),
      true
    )
      .then((response) => response.data.data as StorageDriver)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetUploadLimits(datasetId: number | string): Promise<DatasetUploadLimits> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, 'uploadlimits', datasetId),
      true
    )
      .then((response) => (response.data?.data?.uploadLimits ?? {}) as DatasetUploadLimits)
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetReviews(datasetId: number | string): Promise<DatasetReview[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, 'reviews', datasetId), true)
      .then((response) => transformDatasetReviewsResponseToDatasetReviews(response))
      .catch((error) => {
        throw error
      })
  }

  public async assignRoleOnDataset(
    datasetId: number | string,
    roleAssignee: string,
    roleAlias: string
  ): Promise<void> {
    return this.doPost(this.buildApiEndpoint(this.datasetsResourceName, 'assignments', datasetId), {
      assignee: roleAssignee,
      role: roleAlias
    })
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async unassignRoleOnDataset(
    datasetId: number | string,
    roleAssignmentId: number
  ): Promise<void> {
    return this.doDelete(this.buildApiEndpoint(this.datasetsResourceName, `assignments/${roleAssignmentId}`, datasetId))
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
