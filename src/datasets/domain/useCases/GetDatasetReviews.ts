import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetReview } from '../models/DatasetReview'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetReviews implements UseCase<DatasetReview[]> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the local review datasets that review the given dataset.
   *
   * @param {number | string} datasetId - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<DatasetReview[]>}
   */
  async execute(datasetId: number | string): Promise<DatasetReview[]> {
    return this.datasetsRepository.getDatasetReviews(datasetId)
  }
}
