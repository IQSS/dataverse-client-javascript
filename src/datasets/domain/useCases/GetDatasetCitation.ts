import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetNotNumberedVersion } from '../models/DatasetNotNumberedVersion'

export class GetDatasetCitation implements UseCase<string> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the Dataset citation text.
   *
   * @param {number} [datasetId] - The dataset identifier.
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @param {boolean} [includeDeaccessioned=false] - Indicates whether to consider deaccessioned versions in the dataset search or not. The default value is false
   * @returns {Promise<string>}
   */
  async execute(
    datasetId: number,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned = false
  ): Promise<string> {
    return await this.datasetsRepository.getDatasetCitation(
      datasetId,
      datasetVersionId,
      includeDeaccessioned
    )
  }
}
