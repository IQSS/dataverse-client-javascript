import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';
import { FileCriteria } from '../models/FileCriteria';

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
    fileCriteria?: FileCriteria,
  ): Promise<File[]> {
    return await this.filesRepository.getDatasetFiles(datasetId, datasetVersionId, limit, offset, fileCriteria);
  }
}
