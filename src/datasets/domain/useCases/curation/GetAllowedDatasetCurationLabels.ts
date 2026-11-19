import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'

export class GetAllowedDatasetCurationLabels implements UseCase<string[]> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Returns the effective allowed labels. Requires publish permission.
   * @param datasetId Numeric dataset ID or persistent identifier.
   */
  async execute(datasetId: number | string): Promise<string[]> {
    return await this.datasetsRepository.getAllowedDatasetCurationLabels(datasetId)
  }
}
