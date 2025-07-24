import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetAvailableCategories implements UseCase<string[]> {
  private readonly datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Retrieves the available file categories for a dataset.
   *
   * @param {number | string} [datasetId] - Persistent dataset identifier
   * @returns {Promise<string[]>} - List of available file categories
   */
  async execute(datasetId: number | string): Promise<string[]> {
    return this.datasetsRepository.getDatasetAvailableCategories(datasetId)
  }
}
