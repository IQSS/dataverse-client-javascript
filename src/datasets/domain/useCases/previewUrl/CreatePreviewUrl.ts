import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'
import { PreviewUrl } from '../../models/PreviewUrl'

export class CreatePreviewUrl implements UseCase<PreviewUrl> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Creates a Preview URL for the given dataset, allowing a reviewer without credentials to access its latest (unpublished) version. Requires permission to manage the dataset's permissions.
   *
   * @param {number | string} datasetId - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {boolean} [anonymizedAccess] - If true, and Anonymized Access is enabled on the installation, the Preview URL will only allow an anonymized view of the dataset (optional).
   * @returns {Promise<PreviewUrl>}
   */
  async execute(datasetId: number | string, anonymizedAccess?: boolean): Promise<PreviewUrl> {
    return await this.datasetsRepository.createPreviewUrl(datasetId, anonymizedAccess)
  }
}
