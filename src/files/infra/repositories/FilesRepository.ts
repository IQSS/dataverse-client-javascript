import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { File } from '../../domain/models/File';
import { transformFilesResponseToFiles } from './transformers/fileTransformers';
import { FileDataTable } from '../../domain/models/FileDataTable';
import { transformDataTablesResponseToDataTables } from './transformers/fileDataTableTransformers';
import { FileUserPermissions } from '../../domain/models/FileUserPermissions';
import { transformFileUserPermissionsResponseToFileUserPermissions } from './transformers/fileUserPermissionsTransformers';
import { FileSearchCriteria, FileOrderCriteria } from '../../domain/models/FileCriteria';
import { FileCounts } from '../../domain/models/FileCounts';
import { transformFileCountsResponseToFileCounts } from './transformers/fileCountsTransformers';
import { FileDownloadSizeMode } from '../../domain/models/FileDownloadSizeMode';

export interface GetFilesQueryParams {
  includeDeaccessioned: boolean;
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
    includeDeaccessioned: boolean,
    fileOrderCriteria: FileOrderCriteria,
    limit?: number,
    offset?: number,
    fileSearchCriteria?: FileSearchCriteria,
  ): Promise<File[]> {
    const queryParams: GetFilesQueryParams = {
      includeDeaccessioned: includeDeaccessioned,
      orderCriteria: fileOrderCriteria.toString(),
    };
    if (limit !== undefined) {
      queryParams.limit = limit;
    }
    if (offset !== undefined) {
      queryParams.offset = offset;
    }
    if (fileSearchCriteria !== undefined) {
      this.applyFileSearchCriteriaToQueryParams(queryParams, fileSearchCriteria);
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

  public async getDatasetFileCounts(
    datasetId: string | number,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
  ): Promise<FileCounts> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/files/counts`, datasetId),
      true,
      {
        includeDeaccessioned: includeDeaccessioned,
      },
    )
      .then((response) => transformFileCountsResponseToFileCounts(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetFilesTotalDownloadSize(
    datasetId: number | string,
    datasetVersionId: string,
    fileDownloadSizeMode: FileDownloadSizeMode,
  ): Promise<number> {
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/downloadsize`, datasetId),
      true,
      {
        mode: fileDownloadSizeMode.toString(),
      },
    )
      .then((response) => response.data.data.storageSize)
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

  private applyFileSearchCriteriaToQueryParams(
    queryParams: GetFilesQueryParams,
    fileSearchCriteria: FileSearchCriteria,
  ) {
    if (fileSearchCriteria.accessStatus !== undefined) {
      queryParams.accessStatus = fileSearchCriteria.accessStatus.toString();
    }
    if (fileSearchCriteria.categoryName !== undefined) {
      queryParams.categoryName = fileSearchCriteria.categoryName;
    }
    if (fileSearchCriteria.contentType !== undefined) {
      queryParams.contentType = fileSearchCriteria.contentType;
    }
    if (fileSearchCriteria.searchText !== undefined) {
      queryParams.searchText = fileSearchCriteria.searchText;
    }
  }
}
