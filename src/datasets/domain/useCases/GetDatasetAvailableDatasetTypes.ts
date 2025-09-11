import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetType } from '../models/DatasetType'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetAvailableDatasetTypes implements UseCase<DatasetType[]> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the list of available dataset types that can be selected when creating a dataset.
   *
   * @returns {Promise<DatasetType[]>}
   */
  async execute(): Promise<DatasetType[]> {
    return await this.datasetsRepository.getDatasetAvailableDatasetTypes()
  }
}
