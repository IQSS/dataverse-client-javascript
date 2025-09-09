import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetType } from '../models/DatasetType'
import { IDatasetTypesRepository } from '../repositories/IDatasetTypesRepository'

export class GetAvailableDatasetTypes implements UseCase<DatasetType[]> {
  private datasetTypesRepository: IDatasetTypesRepository

  constructor(datasetTypesRepository: IDatasetTypesRepository) {
    this.datasetTypesRepository = datasetTypesRepository
  }

  /**
   * Returns the list of available dataset types that can be selected for a dataset.
   *
   * @returns {Promise<DatasetType[]>}
   */
  async execute(): Promise<DatasetType[]> {
    return await this.datasetTypesRepository.getAvailableDatasetTypes()
  }
}
