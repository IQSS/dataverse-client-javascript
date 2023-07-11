import { FileOrderCriteria } from '../models/FileOrderCriteria';
import { File } from '../models/File';

export interface IFilesRepository {
  getFilesByDatasetId(
    datasetId: number,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]>;
}
