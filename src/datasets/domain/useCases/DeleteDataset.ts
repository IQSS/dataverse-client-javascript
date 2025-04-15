import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class DeleteDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Delete a Draft Dataset
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   */
  async execute(datasetId: number | string): Promise<void> {
    return this.datasetsRepository.deleteDataset(datasetId)
  }
}
