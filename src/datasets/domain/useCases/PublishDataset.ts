import { UseCase } from '../../../core/domain/useCases/UseCase'
import { VersionUpdateType } from '../models/Dataset'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository' // Assuming Axios for HTTP requests

export class PublishDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Publishes a dataset, given its identifier and the type of version update type.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {VersionUpdateType} versionUpdateType - Specifies the type of version update, 'major', 'minor' or 'updatecurrent'
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(datasetId: number | string, versionUpdateType: VersionUpdateType): Promise<void> {
    return await this.datasetsRepository.publishDataset(datasetId, versionUpdateType)
  }
}
