import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { Dataset } from '../models/Dataset';

export class GetDatasetByPersistentId implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(datasetPersistentId: string, datasetVersionId?: number): Promise<Dataset> {
    return await this.datasetsRepository.getDatasetByPersistentId(datasetPersistentId, datasetVersionId);
  }
}
