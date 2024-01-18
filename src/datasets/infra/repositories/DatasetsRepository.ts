import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository';
import { Dataset } from '../../domain/models/Dataset';
import { transformVersionResponseToDataset } from './transformers/datasetTransformers';
import { DatasetUserPermissions } from '../../domain/models/DatasetUserPermissions';
import { transformDatasetUserPermissionsResponseToDatasetUserPermissions } from './transformers/datasetUserPermissionsTransformers';
import { DatasetLock } from '../../domain/models/DatasetLock';
import { transformDatasetLocksResponseToDatasetLocks } from './transformers/datasetLocksTransformers';
import { transformDatasetPreviewsResponseToDatasetPreviewSubset } from './transformers/datasetPreviewsTransformers';
import { DatasetPreviewSubset } from '../../domain/models/DatasetPreviewSubset';
import { NewDataset } from '../../domain/models/NewDataset';
import { MetadataBlock } from '../../../metadataBlocks';

export interface GetAllDatasetPreviewsQueryParams {
  per_page?: number;
  start?: number;
}

export class DatasetsRepository extends ApiRepository implements IDatasetsRepository {
  private readonly datasetsResourceName: string = 'datasets';

  public async getDatasetSummaryFieldNames(): Promise<string[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, 'summaryFieldNames'))
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  public async getPrivateUrlDataset(token: string): Promise<Dataset> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, `privateUrlDatasetVersion/${token}`))
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDataset(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
  ): Promise<Dataset> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}`, datasetId),
      true,
      {
        includeDeaccessioned: includeDeaccessioned,
        includeFiles: false,
      },
    )
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetCitation(
    datasetId: number,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
  ): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/citation`, datasetId),
      true,
      { includeDeaccessioned: includeDeaccessioned },
    )
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error;
      });
  }

  public async getPrivateUrlDatasetCitation(token: string): Promise<string> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, `privateUrlDatasetVersion/${token}/citation`))
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetUserPermissions(datasetId: string | number): Promise<DatasetUserPermissions> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, `userPermissions`, datasetId), true)
      .then((response) => transformDatasetUserPermissionsResponseToDatasetUserPermissions(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetLocks(datasetId: string | number): Promise<DatasetLock[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, `locks`, datasetId), true)
      .then((response) => transformDatasetLocksResponseToDatasetLocks(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getAllDatasetPreviews(limit?: number, offset?: number): Promise<DatasetPreviewSubset> {
    const queryParams: GetAllDatasetPreviewsQueryParams = {};
    if (limit !== undefined) {
      queryParams.per_page = limit;
    }
    if (offset !== undefined) {
      queryParams.start = offset;
    }
    return this.doGet('/search?q=*&type=dataset&sort=date&order=desc', true, queryParams)
      .then((response) => transformDatasetPreviewsResponseToDatasetPreviewSubset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async createDataset(newDataset: NewDataset, datasetMetadataBlocks: MetadataBlock[]): Promise<void> {
    console.log(newDataset + ' ' + datasetMetadataBlocks.length);
  }
}
