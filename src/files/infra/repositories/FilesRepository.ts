import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IFilesRepository } from '../../domain/repositories/IFilesRepository';
import { FileOrderCriteria } from '../../domain/models/FileOrderCriteria';
import { File } from '../../domain/models/File';

export class FilesRepository extends ApiRepository implements IFilesRepository {
  public async getFilesByDatasetId(
    datasetId: number,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]> {
    throw new Error(
      `Method not implemented. Params: ${datasetId} ${datasetVersionId} ${limit} ${offset} ${orderCriteria}`,
    );
  }
}
