import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetVersionDiff } from '../models/DatasetVersionDiff'

export class GetDatasetVersionDiff implements UseCase<DatasetVersionDiff> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a Dataset instance, given the search parameters to identify it.
   *  TODO: should we allow DatasetNotNumberedVersion enum values for newVersionId and oldVersionId?
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string } [newVersionId] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @param {string } [oldVersionId] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST * @param {boolean} [includeDeaccessioned=false] - Indicates whether to consider deaccessioned versions in the dataset search or not. The default value is false
   * @returns {Promise<DatasetVersionDiff>}
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
