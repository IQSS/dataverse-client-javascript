import { UseCase } from '../../../core/domain/useCases/UseCase';
import { FileOrderCriteria } from '../models/FileOrderCriteria';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';

export class GetFilesByDatasetPersistentId implements UseCase<File[]> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetPersistentId: string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]> {
    return await this.filesRepository.getFilesByDatasetPersistentId(
      datasetPersistentId,
      datasetVersionId,
      limit,
      offset,
      orderCriteria,
    );
  }
}
