import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { DatasetNotNumberedVersion } from '../../../datasets';
import { FileCounts } from '../models/FileCounts';

export class GetDatasetFileCounts implements UseCase<FileCounts> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned: boolean = false,
  ): Promise<FileCounts> {
    return await this.filesRepository.getDatasetFileCounts(datasetId, datasetVersionId, includeDeaccessioned);
  }
}
