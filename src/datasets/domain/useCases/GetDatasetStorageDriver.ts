import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { StorageDriver } from '../../../core/domain/models/StorageDriver'

export class GetDatasetStorageDriver implements UseCase<StorageDriver> {
  private readonly datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the current storage driver used for a dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<StorageDriver>}
   */
  async execute(datasetId: number | string): Promise<StorageDriver> {
    return this.datasetsRepository.getDatasetStorageDriver(datasetId)
  }
}
