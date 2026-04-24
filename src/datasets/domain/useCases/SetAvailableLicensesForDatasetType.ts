import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class SetAvailableLicensesForDatasetType implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Sets the available licenses for a given dataset type. This limits the license options when creating a dataset of this type.
   *
   * @param {number | string} [datasetTypeId] - The dataset type identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string[]} licenses - The licenses to set for the dataset type.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(datasetTypeId: number | string, licenses: string[]): Promise<void> {
    return await this.datasetsRepository.setAvailableLicensesForDatasetType(datasetTypeId, licenses)
  }
}
