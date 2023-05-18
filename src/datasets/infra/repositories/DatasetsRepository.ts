import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository';
import { Dataset } from '../../domain/models/Dataset';
import { MissingParameterError } from '../../../core/domain/repositories/MissingParameterError';
import {
  transformVersionResponseToDataset,
  transformLatestVersionResponseToDataset,
} from './transformers/datasetTransformers';

export class DatasetsRepository extends ApiRepository implements IDatasetsRepository {
  public async getDatasetSummaryFieldNames(): Promise<string[]> {
    return this.doGet('/datasets/summaryFieldNames')
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  public async getDataset(
    datasetId?: number,
    datasetPersistentId?: string,
    datasetVersionId?: number,
  ): Promise<Dataset> {
    if (datasetId != null) {
      return this.getDatasetById(datasetId, datasetVersionId);
    } else if (datasetPersistentId != null) {
      return this.getDatasetByPersistentId(datasetPersistentId, datasetVersionId);
    } else {
      throw new MissingParameterError('Dataset ID or Persistent ID should be provided to getDataset operation');
    }
  }

  private async getDatasetById(datasetId: number, datasetVersionId?: number): Promise<Dataset> {
    if (datasetVersionId == null) {
      return this.getDatasetLatestVersion(`/datasets/${datasetId}`);
    } else {
      return this.getDatasetParticularVersion(`/datasets/${datasetId}/versions/${datasetVersionId}`);
    }
  }

  private async getDatasetByPersistentId(datasetPersistentId: string, datasetVersionId?: number): Promise<Dataset> {
    if (datasetVersionId == null) {
      return this.getDatasetLatestVersion(`/datasets/:persistentId?persistentId=${datasetPersistentId}`);
    } else {
      return this.getDatasetParticularVersion(
        `/datasets/:persistentId/versions/${datasetVersionId}?persistentId=${datasetPersistentId}`,
      );
    }
  }

  private async getDatasetLatestVersion(endpoint: string): Promise<Dataset> {
    return this.doGet(endpoint, true)
      .then((response) => transformLatestVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }

  private async getDatasetParticularVersion(endpoint: string): Promise<Dataset> {
    return this.doGet(endpoint, true)
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }
}
