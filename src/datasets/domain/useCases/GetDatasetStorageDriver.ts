import { UseCase } from '../../../core/domain/useCases/UseCase'
import { StorageDriver } from '../../../core/domain/models/StorageDriver'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetStorageDriver implements UseCase<StorageDriver> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the storage driver information for a given Dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<StorageDriver>}
   */
  async execute(datasetId: number | string): Promise<StorageDriver> {
    return this.datasetsRepository.getDatasetStorageDriver(datasetId)
  }
}
