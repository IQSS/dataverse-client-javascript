import { UseCase } from '../../../core/domain/useCases/UseCase';
import { FileOrderCriteria } from '../models/FileOrderCriteria';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';

export class GetFilesByDatasetId implements UseCase<File[]> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetId: number,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]> {
    return await this.filesRepository.getFilesByDatasetId(datasetId, datasetVersionId, limit, offset, orderCriteria);
  }
}
