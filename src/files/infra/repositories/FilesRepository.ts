import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { File } from '../../domain/models/File';
import { transformFileResponseToFile, transformFilesResponseToFilesSubset } from './transformers/fileTransformers';
import { FilesSubset } from '../../domain/models/FilesSubset';
import { FileDataTable } from '../../domain/models/FileDataTable';
import { transformDataTablesResponseToDataTables } from './transformers/fileDataTableTransformers';
import { FileUserPermissions } from '../../domain/models/FileUserPermissions';
import { transformFileUserPermissionsResponseToFileUserPermissions } from './transformers/fileUserPermissionsTransformers';
import { FileSearchCriteria, FileOrderCriteria } from '../../domain/models/FileCriteria';
import { FileCounts } from '../../domain/models/FileCounts';
import { transformFileCountsResponseToFileCounts } from './transformers/fileCountsTransformers';
import { FileDownloadSizeMode } from '../../domain/models/FileDownloadSizeMode';
import { DatasetNotNumberedVersion } from '../../../datasets';

export interface GetFilesQueryParams {
  includeDeaccessioned: boolean;
  limit?: number;
  offset?: number;
  orderCriteria?: string;
  contentType?: string;
  accessStatus?: string;
  categoryName?: string;
  tabularTagName?: string;
  searchText?: string;
}

export interface GetFilesTotalDownloadSizeQueryParams {
  includeDeaccessioned: boolean;
  mode?: string;
  contentType?: string;
  accessStatus?: string;
  categoryName?: string;
  tabularTagName?: string;
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
  ): Promise<FilesSubset> {
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
      .then((response) => transformFilesResponseToFilesSubset(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetFileCounts(
    datasetId: string | number,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    fileSearchCriteria?: FileSearchCriteria,
  ): Promise<FileCounts> {
    const queryParams: GetFilesQueryParams = {
      includeDeaccessioned: includeDeaccessioned,
    };
    if (fileSearchCriteria !== undefined) {
      this.applyFileSearchCriteriaToQueryParams(queryParams, fileSearchCriteria);
    }
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/files/counts`, datasetId),
      true,
      queryParams,
    )
      .then((response) => transformFileCountsResponseToFileCounts(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getDatasetFilesTotalDownloadSize(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    fileDownloadSizeMode: FileDownloadSizeMode,
    fileSearchCriteria?: FileSearchCriteria,
  ): Promise<number> {
    const queryParams: GetFilesTotalDownloadSizeQueryParams = {
      includeDeaccessioned: includeDeaccessioned,
      mode: fileDownloadSizeMode.toString(),
    };
    if (fileSearchCriteria !== undefined) {
      this.applyFileSearchCriteriaToQueryParams(queryParams, fileSearchCriteria);
    }
    return this.doGet(
      this.buildApiEndpoint(this.datasetsResourceName, `versions/${datasetVersionId}/downloadsize`, datasetId),
      true,
      queryParams,
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

  public async getFile(fileId: number | string, datasetVersionId: string): Promise<File> {
    return this.doGet(this.getFileEndpoint(fileId, datasetVersionId), true, { returnOwners: true })
      .then((response) => transformFileResponseToFile(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getFileCitation(
    fileId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
  ): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(this.filesResourceName, `versions/${datasetVersionId}/citation`, fileId),
      true,
      { includeDeaccessioned: includeDeaccessioned },
    )
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error;
      });
  }

  private getFileEndpoint(fileId: number | string, datasetVersionId: string): string {
    if (datasetVersionId === DatasetNotNumberedVersion.DRAFT) {
      return this.buildApiEndpoint(this.filesResourceName, 'draft', fileId);
    }
    if (datasetVersionId === DatasetNotNumberedVersion.LATEST) {
      return this.buildApiEndpoint(this.filesResourceName, '', fileId);
    }
    // TODO: Implement once it is supported by the API https://github.com/IQSS/dataverse/issues/10280
    throw new Error(
      `Requesting a file by its dataset version is not yet supported. Requested version: ${datasetVersionId}. Please try using the :latest or :draft version instead.`,
    );
  }

  private applyFileSearchCriteriaToQueryParams(
    queryParams: GetFilesQueryParams | GetFilesTotalDownloadSizeQueryParams,
    fileSearchCriteria: FileSearchCriteria,
  ) {
    if (fileSearchCriteria.accessStatus !== undefined) {
      queryParams.accessStatus = fileSearchCriteria.accessStatus.toString();
    }
    if (fileSearchCriteria.categoryName !== undefined) {
      queryParams.categoryName = fileSearchCriteria.categoryName;
    }
    if (fileSearchCriteria.tabularTagName !== undefined) {
      queryParams.tabularTagName = fileSearchCriteria.tabularTagName;
    }
    if (fileSearchCriteria.contentType !== undefined) {
      queryParams.contentType = fileSearchCriteria.contentType;
    }
    if (fileSearchCriteria.searchText !== undefined) {
      queryParams.searchText = fileSearchCriteria.searchText;
    }
  }
}
