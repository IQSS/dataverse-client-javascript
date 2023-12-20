import { Dataset } from '../models/Dataset';
import { DatasetUserPermissions } from '../models/DatasetUserPermissions';
import { DatasetLock } from '../models/DatasetLock';
import { DatasetPreview } from '../models/DatasetPreview';

export interface IDatasetsRepository {
  getDatasetSummaryFieldNames(): Promise<string[]>;
  getDataset(datasetId: number | string, datasetVersionId: string, includeDeaccessioned: boolean): Promise<Dataset>;
  getPrivateUrlDataset(token: string): Promise<Dataset>;
  getDatasetCitation(datasetId: number, datasetVersionId: string, includeDeaccessioned: boolean): Promise<string>;
  getPrivateUrlDatasetCitation(token: string): Promise<string>;
  getDatasetUserPermissions(datasetId: number | string): Promise<DatasetUserPermissions>;
  getDatasetLocks(datasetId: number | string): Promise<DatasetLock[]>;
  getAllDatasetPreviews(limit?: number, offset?: number): Promise<DatasetPreview[]>;
}
