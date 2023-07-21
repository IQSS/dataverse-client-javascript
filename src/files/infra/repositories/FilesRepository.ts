import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { FileOrderCriteria } from '../../domain/models/FileOrderCriteria';
import { File } from '../../domain/models/File';
import { transformFilesResponseToFiles } from './transformers/fileTransformers';
import { FileThumbnailClass } from '../../domain/models/FileThumbnailClass';

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

  public async getFileGuestbookResponsesCount(fileId: number | string): Promise<number> {
    let endpoint;
    if (typeof fileId === 'number') {
      endpoint = `/files/${fileId}/guestbookResponses/count`;
    } else {
      endpoint = `/files/:persistentId/guestbookResponses/count?persistentId=${fileId}`;
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
}
