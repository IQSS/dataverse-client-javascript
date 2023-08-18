import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository';
import { Dataset } from '../../domain/models/Dataset';
import { transformVersionResponseToDataset } from './transformers/datasetTransformers';

export class DatasetsRepository extends ApiRepository implements IDatasetsRepository {
  public async getDatasetSummaryFieldNames(): Promise<string[]> {
    return this.doGet('/datasets/summaryFieldNames')
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  public async getPrivateUrlDataset(token: string): Promise<Dataset> {
    return this.doGet(`/datasets/privateUrlDatasetVersion/${token}`)
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDataset(datasetId: number | string, datasetVersionId: string): Promise<Dataset> {
    let endpoint;
    if (typeof datasetId === 'number') {
      endpoint = `/datasets/${datasetId}/versions/${datasetVersionId}`;
    } else {
      endpoint = `/datasets/:persistentId/versions/${datasetVersionId}?persistentId=${datasetId}`;
    }
    return this.doGet(endpoint, true)
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetCitation(datasetId: number, datasetVersionId: string): Promise<string> {
    return this.doGet(`/datasets/${datasetId}/versions/${datasetVersionId}/citation`, true)
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error;
      });
  }

  public async getPrivateUrlDatasetCitation(token: string): Promise<string> {
    return this.doGet(`/datasets/privateUrlDatasetVersion/${token}/citation`)
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error;
      });
  }
}
