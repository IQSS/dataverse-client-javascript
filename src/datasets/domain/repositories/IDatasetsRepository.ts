import { Dataset } from '../models/Dataset';

export interface IDatasetsRepository {
  getDatasetSummaryFieldNames(): Promise<string[]>;
  getDataset(datasetId?: number, datasetPersistentId?: string, datasetVersionId?: number): Promise<Dataset>;
}
