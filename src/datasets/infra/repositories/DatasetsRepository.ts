import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository';
import { Dataset } from '../../domain/models/Dataset';

export class DatasetsRepository extends ApiRepository implements IDatasetsRepository {
  public async getDatasetSummaryFieldNames(): Promise<string[]> {
    return this.doGet('/datasets/summaryFieldNames')
      .then((response) => response.data.data)
      .catch((error) => {
        throw error;
      });
  }

  public async getDataset(
    datasetId?: string,
    datasetPersistentId?: string,
    datasetVersionId?: string,
  ): Promise<Dataset> {
    console.log(datasetId + datasetPersistentId + datasetVersionId);
    throw new Error('Method not implemented.');
  }
}
