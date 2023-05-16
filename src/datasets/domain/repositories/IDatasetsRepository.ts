import { Dataset } from '../models/Dataset';

export interface IDatasetsRepository {
  getDatasetSummaryFieldNames(): Promise<string[]>;
  getDataset(datasetId?: string, datasetPersistentId?: string, datasetVersionId?: string): Promise<Dataset>;
}
