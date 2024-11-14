import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetVersionDiff } from '../models/DatasetVersionDiff'

export class GetDatasetVersionDiff implements UseCase<DatasetVersionDiff> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a DatasetVersionDiff instance, which contains the differences between the two given versions.
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string } [newVersionId] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value.
   * @param {string } [oldVersionId] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value.
   */
  async execute(
    datasetId: number | string,
    newVersionId: string,
    oldVersionId: string
  ): Promise<DatasetVersionDiff> {
    return await this.datasetsRepository.getDatasetVersionDiff(
      datasetId,
      newVersionId,
      oldVersionId
    )
  }
}
