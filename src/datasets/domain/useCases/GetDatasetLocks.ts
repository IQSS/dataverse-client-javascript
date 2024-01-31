import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { DatasetLock } from '../models/DatasetLock';

export class GetDatasetLocks implements UseCase<DatasetLock[]> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  /**
   * Returns all locks present in a Dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<DatasetLock[]>}
   */
  async execute(datasetId: number | string): Promise<DatasetLock[]> {
    return await this.datasetsRepository.getDatasetLocks(datasetId);
  }
}
