import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class DeleteDatasetType implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Deletes a dataset type.
   */
  async execute(datasetTypeId: number): Promise<void> {
    return await this.datasetsRepository.deleteDatasetType(datasetTypeId)
  }
}
