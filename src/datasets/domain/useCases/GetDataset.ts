import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { Dataset } from '../models/Dataset';

export class GetDataset implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(datasetId?: number, datasetPersistentId?: string, datasetVersionId?: number): Promise<Dataset> {
    return await this.datasetsRepository.getDataset(datasetId, datasetPersistentId, datasetVersionId);
  }
}
