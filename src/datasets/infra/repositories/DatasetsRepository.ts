import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository'
import { Dataset, VersionUpdateType } from '../../domain/models/Dataset'
import { transformVersionResponseToDataset } from './transformers/datasetTransformers'
import { DatasetUserPermissions } from '../../domain/models/DatasetUserPermissions'
import { transformDatasetUserPermissionsResponseToDatasetUserPermissions } from './transformers/datasetUserPermissionsTransformers'
import { DatasetLock } from '../../domain/models/DatasetLock'
import { transformDatasetLocksResponseToDatasetLocks } from './transformers/datasetLocksTransformers'
import { transformDatasetPreviewsResponseToDatasetPreviewSubset } from './transformers/datasetPreviewsTransformers'
import { DatasetPreviewSubset } from '../../domain/models/DatasetPreviewSubset'
import { NewDatasetDTO } from '../../domain/dtos/NewDatasetDTO'
import { MetadataBlock } from '../../../metadataBlocks'
import { transformNewDatasetModelToRequestPayload } from './transformers/newDatasetTransformers'
import { CreatedDatasetIdentifiers } from '../../domain/models/CreatedDatasetIdentifiers'

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

  public async getPrivateUrlDataset(token: string): Promise<Dataset> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `privateUrlDatasetVersion/${token}`),
      false,
      {
        returnOwners: true
      }
    )
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error
      })
  }

  public async getDataset(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean
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
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error
      })
  }

  public async getDatasetCitation(
    datasetId: number,
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

  public async createDataset(
    newDataset: NewDatasetDTO,
    datasetMetadataBlocks: MetadataBlock[],
    collectionId: string
  ): Promise<CreatedDatasetIdentifiers> {
    return this.doPost(
      `/dataverses/${collectionId}/datasets`,
      transformNewDatasetModelToRequestPayload(newDataset, datasetMetadataBlocks)
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
}
