import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { DatasetLock } from '../models/DatasetLock';

export class GetDatasetLocks implements UseCase<DatasetLock[]> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(datasetId: number | string): Promise<DatasetLock[]> {
    return await this.datasetsRepository.getDatasetLocks(datasetId);
  }
}
