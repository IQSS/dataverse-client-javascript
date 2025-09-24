import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class SetAvailableLicensesForDatasetType implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Sets the available licenses for a given dataset type. This limits the license options when creating a dataset of this type.
   */
  async execute(datasetTypeId: number | string, licenses: string[]): Promise<void> {
    return await this.datasetsRepository.setAvailableLicensesForDatasetType(datasetTypeId, licenses)
  }
}
