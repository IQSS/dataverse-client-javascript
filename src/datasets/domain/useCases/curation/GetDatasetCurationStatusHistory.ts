import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'
import { DatasetCurationStatus } from '../../models/DatasetCuration'

export class GetDatasetCurationStatusHistory implements UseCase<DatasetCurationStatus[]> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Returns curation assignments and removals in server order, newest first.
   * @param datasetId Numeric dataset ID or persistent identifier.
   */
  async execute(datasetId: number | string): Promise<DatasetCurationStatus[]> {
    return await this.datasetsRepository.getDatasetCurationStatusHistory(datasetId)
  }
}
