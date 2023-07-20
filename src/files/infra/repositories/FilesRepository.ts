import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { FileOrderCriteria } from '../../domain/models/FileOrderCriteria';
import { File } from '../../domain/models/File';
import { transformFilesResponseToFiles } from './transformers/fileTransformers';

export interface GetFilesQueryParams {
  limit?: number;
  offset?: number;
  orderCriteria?: string;
}

export class FilesRepository extends ApiRepository implements IFilesRepository {
  public async getFilesByDatasetId(
    datasetId: number,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]> {
    if (datasetVersionId === undefined) {
      datasetVersionId = this.DATASET_VERSION_LATEST;
    }
    return this.getFiles(`/datasets/${datasetId}/versions/${datasetVersionId}/files`, limit, offset, orderCriteria);
  }

  public async getFilesByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]> {
    if (datasetVersionId === undefined) {
      datasetVersionId = this.DATASET_VERSION_LATEST;
    }
    return this.getFiles(
      `/datasets/:persistentId/versions/${datasetVersionId}/files?persistentId=${datasetPersistentId}`,
      limit,
      offset,
      orderCriteria,
    );
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

  private async getFiles(
    endpoint: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]> {
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
}
