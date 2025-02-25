import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetVersionInfo } from '../models/DatasetVersionInfo'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetVersions implements UseCase<DatasetVersionInfo[]> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a list of versions for a given dataset including a summary of differences between consecutive versions where available.
   * Draft versions will only be available to users who have permission to view unpublished drafts.
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<DatasetVersionInfo[]>} - An array of DatasetVersionInfo.
   */
  async execute(datasetId: number | string): Promise<DatasetVersionInfo[]> {
    return await this.datasetsRepository.getDatasetVersions(datasetId)
  }
}
