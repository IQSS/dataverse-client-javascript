import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { FileOrderCriteria } from '../../domain/models/FileOrderCriteria';
import { File } from '../../domain/models/File';
import { transformFilesResponseToFiles } from './transformers/fileTransformers';
import { FileThumbnailClass } from '../../domain/models/FileThumbnailClass';
import { FileDataTable } from '../../domain/models/FileDataTable';
import { transformDataTablesResponseToDataTables } from './transformers/fileDataTableTransformers';

export interface GetFilesQueryParams {
  limit?: number;
  offset?: number;
  orderCriteria?: string;
}

export class FilesRepository extends ApiRepository implements IFilesRepository {
  public async getDatasetFiles(
    datasetId: number | string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
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
    if (orderCriteria !== undefined) {
      queryParams.orderCriteria = orderCriteria.toString();
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

  public async canFileBeDownloaded(fileId: string | number): Promise<boolean> {
    let endpoint;
    if (typeof fileId === 'number') {
      endpoint = `/files/${fileId}/canBeDownloaded`;
    } else {
      endpoint = `/files/:persistentId/canBeDownloaded?persistentId=${fileId}`;
    }
    return this.doGet(endpoint, true)
      .then((response) => response.data.data as boolean)
      .catch((error) => {
        throw error;
      });
  }

  public async getFileThumbnailClass(fileId: string | number): Promise<FileThumbnailClass> {
    let endpoint;
    if (typeof fileId === 'number') {
      endpoint = `/files/${fileId}/thumbnailClass`;
    } else {
      endpoint = `/files/:persistentId/thumbnailClass?persistentId=${fileId}`;
    }
    return this.doGet(endpoint, true)
      .then((response) => response.data.data.message as FileThumbnailClass)
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
}
