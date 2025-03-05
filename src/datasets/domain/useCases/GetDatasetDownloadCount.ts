import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
export class GetDatasetDownloadCount implements UseCase<number> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the Dataset Download Count.
   *
   * @param {number} [datasetId] - The dataset identifier.
   * @param {boolean} [includeMDC(optional)] - Indicates whether to consider include counts from MDC start date or not. The default value is false
   * @returns {Promise<number>}
   */
  async execute(datasetId: number, includeMDC?: boolean): Promise<number> {
    return await this.datasetsRepository.getDatasetDownloadCount(datasetId, includeMDC)
  }
}
