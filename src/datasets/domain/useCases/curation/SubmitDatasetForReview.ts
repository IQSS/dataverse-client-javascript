import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'
import { DatasetReviewSubmission } from '../../models/DatasetCuration'

export class SubmitDatasetForReview implements UseCase<DatasetReviewSubmission> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Submits a draft for review. Requires authentication and edit permission; anonymous submissions are not supported.
   * @param datasetId Numeric dataset ID or persistent identifier.
   */
  async execute(datasetId: number | string): Promise<DatasetReviewSubmission> {
    return await this.datasetsRepository.submitDatasetForReview(datasetId)
  }
}
