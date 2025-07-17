import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetLinkedCollection } from '../models/DatasetLinkedCollection'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetLinkedCollections implements UseCase<DatasetLinkedCollection[]> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a list of collections linked to a dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<DatasetLinkedCollection[]>}
   */
  async execute(datasetId: number | string): Promise<DatasetLinkedCollection[]> {
    return await this.datasetsRepository.getDatasetLinkedCollections(datasetId)
  }
}
