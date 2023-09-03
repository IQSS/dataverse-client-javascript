import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { File } from '../../domain/models/File';
import { transformFilesResponseToFiles } from './transformers/fileTransformers';
import { FileDataTable } from '../../domain/models/FileDataTable';
import { transformDataTablesResponseToDataTables } from './transformers/fileDataTableTransformers';
import { FileUserPermissions } from '../../domain/models/FileUserPermissions';
import { transformFileUserPermissionsResponseToFileUserPermissions } from './transformers/fileUserPermissionsTransformers';
import { FileCriteria } from '../../domain/models/FileCriteria';
import { FileCounts } from '../../domain/models/FileCounts';
import { transformFileCountsResponseToFileCounts } from './transformers/fileCountsTransformers';

export interface GetFilesQueryParams {
  limit?: number;
  offset?: number;
  orderCriteria?: string;
  contentType?: string;
  accessStatus?: string;
  categoryName?: string;
  searchText?: string;
}

export class FilesRepository extends ApiRepository implements IFilesRepository {
  private readonly datasetsResourceName: string = 'datasets';
  private readonly filesResourceName: string = 'files';
  private readonly accessResourceName: string = 'access/datafile';

  public async getDatasetFiles(
    datasetId: number | string,
    datasetVersionId: string,
    limit?: number,
    offset?: number,
    fileCriteria?: FileCriteria,
  ): Promise<File[]> {
    const queryParams: GetFilesQueryParams = {};
    if (limit !== undefined) {
      queryParams.limit = limit;
    }
    if (offset !== undefined) {
      queryParams.offset = offset;
    }
    if (fileCriteria !== undefined) {
      this.applyFileCriteriaToQueryParams(queryParams, fileCriteria);
    }
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/files`, datasetId),
      true,
      queryParams,
    )
      .then((response) => transformFilesResponseToFiles(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetFileCounts(datasetId: string | number, datasetVersionId: string): Promise<FileCounts> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/files/counts`, datasetId),
      true,
    )
      .then((response) => transformFileCountsResponseToFileCounts(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getFileDownloadCount(fileId: number | string): Promise<number> {
    return this.doGet(this.buildApiEndpoint(this.filesResourceName, `downloadCount`, fileId), true)
      .then((response) => response.data.data.message as number)
      .catch((error) => {
        throw error;
      });
  }

  public async getFileUserPermissions(fileId: number | string): Promise<FileUserPermissions> {
    return this.doGet(this.buildApiEndpoint(this.accessResourceName, `userPermissions`, fileId), true)
      .then((response) => transformFileUserPermissionsResponseToFileUserPermissions(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getFileDataTables(fileId: string | number): Promise<FileDataTable[]> {
    return this.doGet(this.buildApiEndpoint(this.filesResourceName, `dataTables`, fileId), true)
      .then((response) => transformDataTablesResponseToDataTables(response))
      .catch((error) => {
        throw error;
      });
  }

  private applyFileCriteriaToQueryParams(queryParams: GetFilesQueryParams, fileCriteria: FileCriteria) {
    if (fileCriteria.accessStatus !== undefined) {
      queryParams.accessStatus = fileCriteria.accessStatus.toString();
    }
    if (fileCriteria.categoryName !== undefined) {
      queryParams.categoryName = fileCriteria.categoryName;
    }
    if (fileCriteria.contentType !== undefined) {
      queryParams.contentType = fileCriteria.contentType;
    }
    if (fileCriteria.searchText !== undefined) {
      queryParams.searchText = fileCriteria.searchText;
    }
    if (fileCriteria.orderCriteria !== undefined) {
      queryParams.orderCriteria = fileCriteria.orderCriteria.toString();
    }
  }
}
