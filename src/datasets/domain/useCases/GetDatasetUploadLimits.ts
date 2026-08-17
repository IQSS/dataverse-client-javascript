import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetUploadLimits } from '../models/DatasetUploadLimits'

export class GetDatasetUploadLimits implements UseCase<DatasetUploadLimits> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the remaining dataset storage and/or file upload quotas (if present).
   *
   * @param {number | string} datasetId - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<DatasetUploadLimits>}
   */
  async execute(datasetId: number | string): Promise<DatasetUploadLimits> {
    return this.datasetsRepository.getDatasetUploadLimits(datasetId)
  }
}
