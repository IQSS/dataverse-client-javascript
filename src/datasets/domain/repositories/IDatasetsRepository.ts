import { Dataset } from '../models/Dataset';

export interface IDatasetsRepository {
  getDatasetSummaryFieldNames(): Promise<string[]>;
  getDatasetById(datasetId: number, datasetVersionId?: number): Promise<Dataset>;
  getDatasetByPersistentId(datasetPersistentId: string, datasetVersionId?: number): Promise<Dataset>;
  getPrivateUrlDataset(token: string, anonymizedFieldValue?: string): Promise<Dataset>;
}
