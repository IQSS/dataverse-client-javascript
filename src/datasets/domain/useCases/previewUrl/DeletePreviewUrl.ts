import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'

export class DeletePreviewUrl implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Deletes the Preview URL for the given dataset, if one exists.
   *
   * @param {number | string} datasetId - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<void>}
   */
  async execute(datasetId: number | string): Promise<void> {
    return await this.datasetsRepository.deletePreviewUrl(datasetId)
  }
}
