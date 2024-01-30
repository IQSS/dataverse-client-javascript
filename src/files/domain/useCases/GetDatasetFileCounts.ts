import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { DatasetNotNumberedVersion } from '../../../datasets';
import { FileCounts } from '../models/FileCounts';
import { FileSearchCriteria } from '../models/FileCriteria';

export class GetDatasetFileCounts implements UseCase<FileCounts> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned = false,
    fileSearchCriteria?: FileSearchCriteria,
  ): Promise<FileCounts> {
    return await this.filesRepository.getDatasetFileCounts(
      datasetId,
      datasetVersionId,
      includeDeaccessioned,
      fileSearchCriteria,
    );
  }
}
