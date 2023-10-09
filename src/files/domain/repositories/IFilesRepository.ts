import { File } from '../models/File';
import { FileDataTable } from '../models/FileDataTable';
import { FileUserPermissions } from '../models/FileUserPermissions';
import { FileSearchCriteria, FileOrderCriteria } from '../models/FileCriteria';
import { FileCounts } from '../models/FileCounts';
import { FileDownloadSizeMode } from '../models/FileDownloadSizeMode';

export interface IFilesRepository {
  getDatasetFiles(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    fileOrderCriteria: FileOrderCriteria,
    limit?: number,
    offset?: number,
    fileSearchCriteria?: FileSearchCriteria,
  ): Promise<File[]>;

  getDatasetFileCounts(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
  ): Promise<FileCounts>;

  getDatasetFilesTotalDownloadSize(
    datasetId: number | string,
    datasetVersionId: string,
    fileDownloadSizeMode: FileDownloadSizeMode,
  ): Promise<number>;

  getFileDownloadCount(fileId: number | string): Promise<number>;

  getFileUserPermissions(fileId: number | string): Promise<FileUserPermissions>;

  getFileDataTables(fileId: number | string): Promise<FileDataTable[]>;
}
