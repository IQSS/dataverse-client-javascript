import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetType } from '../models/DatasetType'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class AddDatasetType implements UseCase<DatasetType> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Add a dataset type that can be selected when creating a dataset.
   */
  async execute(datasetType: DatasetType): Promise<DatasetType> {
    return await this.datasetsRepository.addDatasetType(datasetType)
  }
}
