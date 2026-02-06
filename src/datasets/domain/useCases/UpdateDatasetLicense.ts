import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetLicenseUpdateRequest } from '../dtos/DatasetLicenseUpdateRequest'

export class UpdateDatasetLicense implements UseCase<void> {
  private readonly datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Updates the license of a dataset by applying it to the draft version. If no draft exists, a new one is created by the API.
   * Supports either predefined license by name or custom terms of use and access.
   *
   * @param {number | string} datasetId - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {DatasetLicenseUpdateRequest} payload - The payload containing the license name or custom terms of use and access.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(datasetId: number | string, payload: DatasetLicenseUpdateRequest): Promise<void> {
    return this.datasetsRepository.updateDatasetLicense(datasetId, payload)
  }
}
