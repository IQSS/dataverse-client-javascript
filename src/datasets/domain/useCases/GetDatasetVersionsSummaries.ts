import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetVersionSummaryInfo } from '../models/DatasetVersionSummaryInfo'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetVersionsSummaries implements UseCase<DatasetVersionSummaryInfo[]> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a list of versions for a given dataset including a summary of differences between consecutive versions where available.
   * Draft versions will only be available to users who have permission to view unpublished drafts.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {number} [limit] - Limit for pagination (optional).
   * @param {number} [offset] - Offset for pagination (optional).
   * @returns {Promise<DatasetVersionSummaryInfo[]>} - An array of DatasetVersionSummaryInfo.
   */
  async execute(
    datasetId: number | string,
    limit?: number,
    offset?: number
  ): Promise<DatasetVersionSummaryInfo[]> {
    return await this.datasetsRepository.getDatasetVersionsSummaries(datasetId, limit, offset)
  }
}
