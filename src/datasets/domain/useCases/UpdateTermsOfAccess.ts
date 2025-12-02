import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { TermsOfAccess } from '../models/Dataset'

export class UpdateTermsOfAccess implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Sets the terms of access for a given dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {TermsOfAccess} termsOfAccess - The terms of access to set for the dataset.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(datasetId: number | string, termsOfAccess: TermsOfAccess): Promise<void> {
    return await this.datasetsRepository.updateTermsOfAccess(datasetId, termsOfAccess)
  }
}
