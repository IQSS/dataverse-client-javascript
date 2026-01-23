import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetVersionSubset } from '../models/DatasetVersion'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetVersions implements UseCase<DatasetVersionSubset> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a list of versions for a given dataset including (optionally) metadata blocks and files.
   * Draft versions will only be available to users who have permission to view unpublished drafts.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {number} [limit] - Limit for pagination (optional).
   * @param {number} [offset] - Offset for pagination (optional).
   * @param {boolean} [excludeMetadataBlocks] - Exclude metadata blocks (optional, default: false).
   * @returns {Promise<DatasetVersionSubset>} - A DatasetVersionSubset containing the versions and total count.
   */
  async execute(
    datasetId: number | string,
    limit?: number,
    offset?: number,
    excludeMetadataBlocks?: boolean
  ): Promise<DatasetVersionSubset> {
    return await this.datasetsRepository.getDatasetVersions(datasetId, limit, offset, excludeMetadataBlocks)
  }
}
