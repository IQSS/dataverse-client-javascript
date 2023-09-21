import { File } from '../models/File';
import { FileDataTable } from '../models/FileDataTable';
import { FileUserPermissions } from '../models/FileUserPermissions';
import { FileCriteria } from '../models/FileCriteria';
import { FileCounts } from '../models/FileCounts';

export interface IFilesRepository {
  getDatasetFiles(
    datasetId: number | string,
    datasetVersionId: string,
    limit?: number,
    offset?: number,
    fileCriteria?: FileCriteria,
  ): Promise<File[]>;

  getDatasetFileCounts(datasetId: number | string, datasetVersionId: string): Promise<FileCounts>;

  getDatasetFilesTotalDownloadSize(datasetId: number | string, datasetVersionId: string): Promise<number>;

  getFileDownloadCount(fileId: number | string): Promise<number>;

  getFileUserPermissions(fileId: number | string): Promise<FileUserPermissions>;

  getFileDataTables(fileId: number | string): Promise<FileDataTable[]>;
}
