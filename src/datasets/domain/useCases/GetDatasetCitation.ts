import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { DatasetNotNumberedVersion } from '../models/DatasetNotNumberedVersion';

export class GetDatasetCitation implements UseCase<string> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(
    datasetId: number,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned: boolean = false,
  ): Promise<string> {
    return await this.datasetsRepository.getDatasetCitation(datasetId, datasetVersionId, includeDeaccessioned)
  }
}
