import { UseCase } from '../../../core/domain/useCases/UseCase';
import { FileOrderCriteria } from '../models/FileOrderCriteria';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';

export class GetDatasetFiles implements UseCase<File[]> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetId: number | string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: FileOrderCriteria,
  ): Promise<File[]> {
    return await this.filesRepository.getDatasetFiles(datasetId, datasetVersionId, limit, offset, orderCriteria);
  }
}
