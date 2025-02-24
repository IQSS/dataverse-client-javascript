import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetDeaccessionDTO } from '../dtos/DatasetDeaccessionDTO'
import { DatasetNotNumberedVersion } from '../models/DatasetNotNumberedVersion'

export class DeaccessionDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Deaccession a dataset, given a dataset id, a dataset version id, and a DatasetDeaccessionDTO object.
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value.
   * @returns A promise that resolves when the dataset is deaccessioned
   * @throws An error if the dataset could not be deaccessioned
   */
  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion,
    DatasetDeaccessionDTO: DatasetDeaccessionDTO
  ): Promise<void> {
    return await this.datasetsRepository.deaccessionDataset(
      datasetId,
      datasetVersionId,
      DatasetDeaccessionDTO
    )
  }
}
