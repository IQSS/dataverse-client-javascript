import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetDownloadCount } from '../models/DatasetDownloadCount'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetDatasetDownloadCount implements UseCase<DatasetDownloadCount> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a DatasetDownloadCount instance, with dataset id, count and MDCStartDate(optional).
   *
   * @param {number | string} [datasetId] - The dataset identifier.
   * @param {boolean} [includeMDC(optional)] - Indicates whether to consider include counts from MDC start date or not. The default value is false
   * @returns {Promise<DatasetDownloadCount>}
   */
  async execute(datasetId: number | string, includeMDC?: boolean): Promise<DatasetDownloadCount> {
    return await this.datasetsRepository.getDatasetDownloadCount(datasetId, includeMDC)
  }
}
