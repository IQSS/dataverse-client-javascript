import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'

export class DeleteDatasetCurationStatus implements UseCase<void> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Removes the label from a draft, retaining history. Requires publish permission.
   * @param datasetId Numeric dataset ID or persistent identifier.
   */
  async execute(datasetId: number | string): Promise<void> {
    return await this.datasetsRepository.deleteDatasetCurationStatus(datasetId)
  }
}
