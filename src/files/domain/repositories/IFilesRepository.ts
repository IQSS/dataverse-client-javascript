import { FileOrderCriteria } from '../models/FileOrderCriteria';
import { File } from '../models/File';
import { FileDataTable } from '../models/FileDataTable';

export interface IFilesRepository {
  getDatasetFiles(
    datasetId: number | string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]>;

  getFileDownloadCount(fileId: number | string): Promise<number>;

  getFileDataTables(fileId: number | string): Promise<FileDataTable[]>;
}
