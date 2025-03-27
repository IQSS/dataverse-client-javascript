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
   * @param {string } [oldVersionId] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value.
   * @param {string } [newVersionId] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value.
   * @param {boolean} [includeDeaccessioned=false] - Indicates if you want to include deaccessioned dataset versions. The default value is false
   */
  async execute(
    datasetId: number | string,
    oldVersionId: string,
    newVersionId: string,
    includeDeaccessioned = false
  ): Promise<DatasetVersionDiff> {
    return await this.datasetsRepository.getDatasetVersionDiff(
      datasetId,
      oldVersionId,
      newVersionId,
      includeDeaccessioned
    )
  }
}
