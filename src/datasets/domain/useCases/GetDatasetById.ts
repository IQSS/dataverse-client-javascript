import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { Dataset } from '../models/Dataset';

export class GetDatasetById implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(datasetId: number, datasetVersionId?: string): Promise<Dataset> {
    return await this.datasetsRepository.getDatasetById(datasetId, datasetVersionId);
  }
}
