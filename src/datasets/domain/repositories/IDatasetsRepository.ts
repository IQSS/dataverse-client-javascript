import { Dataset } from '../models/Dataset';

export interface IDatasetsRepository {
  getDatasetSummaryFieldNames(): Promise<string[]>;
  getDatasetById(datasetId: number, datasetVersionId?: string): Promise<Dataset>;
  getDatasetByPersistentId(datasetPersistentId: string, datasetVersionId?: string): Promise<Dataset>;
  getPrivateUrlDataset(token: string): Promise<Dataset>;
  getDatasetCitation(datasetId: number, datasetVersionId?: string): Promise<string>;
  getPrivateUrlDatasetCitation(token: string): Promise<string>;
}
