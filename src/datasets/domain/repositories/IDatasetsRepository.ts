import { Dataset } from '../models/Dataset';
import { DatasetUserPermissions } from '../models/DatasetUserPermissions';

export interface IDatasetsRepository {
  getDatasetSummaryFieldNames(): Promise<string[]>;
  getDataset(datasetId: number | string, datasetVersionId: string, includeDeaccessioned: boolean): Promise<Dataset>;
  getPrivateUrlDataset(token: string): Promise<Dataset>;
  getDatasetCitation(datasetId: number, datasetVersionId: string): Promise<string>;
  getPrivateUrlDatasetCitation(token: string): Promise<string>;
  getDatasetUserPermissions(datasetId: number | string): Promise<DatasetUserPermissions>;
}
