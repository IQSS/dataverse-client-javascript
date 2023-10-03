import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IDatasetsRepository } from '../../domain/repositories/IDatasetsRepository';
import { Dataset } from '../../domain/models/Dataset';
import { transformVersionResponseToDataset } from './transformers/datasetTransformers';

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

  public async getDataset(datasetId: number | string, datasetVersionId: string): Promise<Dataset> {
    return this.doGet(this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}`, datasetId), true)
      .then((response) => transformVersionResponseToDataset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetCitation(datasetId: number, datasetVersionId: string): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/citation`, datasetId),
      true,
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
}
