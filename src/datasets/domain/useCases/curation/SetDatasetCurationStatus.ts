import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'

export class SetDatasetCurationStatus implements UseCase<void> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Assigns a configured label to a draft. Requires publish permission; does not change review or publication state.
   * @param datasetId Numeric dataset ID or persistent identifier.
   */
  async execute(datasetId: number | string, label: string): Promise<void> {
    return await this.datasetsRepository.setDatasetCurationStatus(datasetId, label)
  }
}
