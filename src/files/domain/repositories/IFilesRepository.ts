import { File } from '../models/File';
import { FileDataTable } from '../models/FileDataTable';
import { FileUserPermissions } from '../models/FileUserPermissions';
import { FileCriteria } from '../models/FileCriteria';

export interface IFilesRepository {
  getDatasetFiles(
    datasetId: number | string,
    datasetVersionId: string,
    limit?: number,
    offset?: number,
    fileCriteria?: FileCriteria,
  ): Promise<File[]>;

  getFileDownloadCount(fileId: number | string): Promise<number>;

  getFileUserPermissions(fileId: number | string): Promise<FileUserPermissions>;

  getFileDataTables(fileId: number | string): Promise<FileDataTable[]>;
}
