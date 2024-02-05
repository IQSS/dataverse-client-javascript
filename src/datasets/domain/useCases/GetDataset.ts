import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { Dataset } from '../models/Dataset';
import { DatasetNotNumberedVersion } from '../models/DatasetNotNumberedVersion';

export class GetDataset implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned = false,
  ): Promise<Dataset> {
    return await this.datasetsRepository.getDataset(datasetId, datasetVersionId, includeDeaccessioned);
  }
}
