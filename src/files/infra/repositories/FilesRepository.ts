import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { File } from '../../domain/models/File';
import { transformFilesResponseToFiles } from './transformers/fileTransformers';
import { FileDataTable } from '../../domain/models/FileDataTable';
import { transformDataTablesResponseToDataTables } from './transformers/fileDataTableTransformers';
import { FileUserPermissions } from '../../domain/models/FileUserPermissions';
import { transformFileUserPermissionsResponseToFileUserPermissions } from './transformers/fileUserPermissionsTransformers';
import { FileCriteria } from '../../domain/models/FileCriteria';

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
  public async getDatasetFiles(
    datasetId: number | string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    fileCriteria?: FileCriteria,
  ): Promise<File[]> {
    if (datasetVersionId === undefined) {
      datasetVersionId = this.DATASET_VERSION_LATEST;
    }
    let endpoint;
    if (typeof datasetId === 'number') {
      endpoint = `/datasets/${datasetId}/versions/${datasetVersionId}/files`;
    } else {
      endpoint = `/datasets/:persistentId/versions/${datasetVersionId}/files?persistentId=${datasetId}`;
    }
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
    return this.doGet(endpoint, true, queryParams)
      .then((response) => transformFilesResponseToFiles(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getFileDownloadCount(fileId: number | string): Promise<number> {
    let endpoint;
    if (typeof fileId === 'number') {
      endpoint = `/files/${fileId}/downloadCount`;
    } else {
      endpoint = `/files/:persistentId/downloadCount?persistentId=${fileId}`;
    }
    return this.doGet(endpoint, true)
      .then((response) => response.data.data.message as number)
      .catch((error) => {
        throw error;
      });
  }

  public async getFileUserPermissions(fileId: number | string): Promise<FileUserPermissions> {
    let endpoint;
    if (typeof fileId === 'number') {
      endpoint = `/access/datafile/${fileId}/userPermissions`;
    } else {
      endpoint = `/access/datafile/:persistentId/userPermissions?persistentId=${fileId}`;
    }
    return this.doGet(endpoint, true)
      .then((response) => transformFileUserPermissionsResponseToFileUserPermissions(response))
      .catch((error) => {
        throw error;
      });
  }

  public async getFileDataTables(fileId: string | number): Promise<FileDataTable[]> {
    let endpoint;
    if (typeof fileId === 'number') {
      endpoint = `/files/${fileId}/dataTables`;
    } else {
      endpoint = `/files/:persistentId/dataTables?persistentId=${fileId}`;
    }
    return this.doGet(endpoint, true)
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
