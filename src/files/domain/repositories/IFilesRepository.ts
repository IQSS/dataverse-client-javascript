import { FileOrderCriteria } from '../models/FileOrderCriteria';
import { File } from '../models/File';

export interface IFilesRepository {
  getDatasetFiles(
    datasetId: number | string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]>;

  getFileGuestbookResponsesCount(fileId: number | string): Promise<number>;
}
