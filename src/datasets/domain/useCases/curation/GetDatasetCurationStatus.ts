import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'
import { DatasetCurationStatus } from '../../models/DatasetCuration'

export class GetDatasetCurationStatus implements UseCase<DatasetCurationStatus | null> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Returns the latest curation record, or null if none exists. Visibility is enforced by the server.
   * @param datasetId Numeric dataset ID or persistent identifier.
   */
  async execute(datasetId: number | string): Promise<DatasetCurationStatus | null> {
    return await this.datasetsRepository.getDatasetCurationStatus(datasetId)
  }
}
