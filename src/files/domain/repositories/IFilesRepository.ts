import { FileOrderCriteria } from '../models/FileOrderCriteria';
import { File } from '../models/File';
import { FileThumbnailClass } from '../models/FileThumbnailClass';
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

  canFileBeDownloaded(fileId: number | string): Promise<boolean>;

  getFileThumbnailClass(fileId: number | string): Promise<FileThumbnailClass>;

  getFileDataTables(fileId: number | string): Promise<FileDataTable[]>;
}
