import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository';
import { Dataset } from '../../domain/models/Dataset';
import { transformVersionResponseToDataset } from './transformers/datasetTransformers';

export class DatasetsRepository extends ApiRepository implements IDatasetsRepository {
  DATASET_VERSION_LATEST = ':latest';

  public async getDatasetSummaryFieldNames(): Promise<string[]> {
    return this.doGet('/datasets/summaryFieldNames')
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  public async getPrivateUrlDataset(token: string, anonymizedFieldValue?: string): Promise<Dataset> {
    let apiEndpoint = `/datasets/privateUrlDatasetVersion/${token}`;
    if (anonymizedFieldValue !== undefined) {
      apiEndpoint = apiEndpoint + `?anonymizedFieldValue=${anonymizedFieldValue}`;
    }
    return this.doGet(apiEndpoint)
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetById(datasetId: number, datasetVersionId?: string): Promise<Dataset> {
    if (datasetVersionId === undefined) {
      datasetVersionId = this.DATASET_VERSION_LATEST;
    }
    return this.getDatasetVersion(`/datasets/${datasetId}/versions/${datasetVersionId}`);
  }

  public async getDatasetByPersistentId(datasetPersistentId: string, datasetVersionId?: string): Promise<Dataset> {
    if (datasetVersionId === undefined) {
      datasetVersionId = this.DATASET_VERSION_LATEST;
    }
    return this.getDatasetVersion(
      `/datasets/:persistentId/versions/${datasetVersionId}?persistentId=${datasetPersistentId}`,
    );
  }

  public async getDatasetCitation(
    datasetId: number,
    anonymizedAccess: boolean = false,
    datasetVersionId?: string,
  ): Promise<string> {
    if (datasetVersionId === undefined) {
      datasetVersionId = this.DATASET_VERSION_LATEST;
    }
    return this.doGet(
      `/datasets/${datasetId}/versions/${datasetVersionId}/citation?anonymizedAccess=${anonymizedAccess}`,
      true,
    )
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error;
      });
  }

  private async getDatasetVersion(endpoint: string): Promise<Dataset> {
    return this.doGet(endpoint, true)
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }
}
