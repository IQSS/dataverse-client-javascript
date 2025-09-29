import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetType } from '../models/DatasetType'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetAvailableDatasetType implements UseCase<DatasetType> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a single available dataset type that can be selected when creating a dataset.
   */
  async execute(datasetTypeId: number | string): Promise<DatasetType> {
    return await this.datasetsRepository.getDatasetAvailableDatasetType(datasetTypeId)
  }
}
