import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'
import { PreviewUrl } from '../../models/PreviewUrl'

export class GetPreviewUrl implements UseCase<PreviewUrl> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the existing Preview URL for the given dataset, if one has been created.
   *
   * @param {number | string} datasetId - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<PreviewUrl>}
   */
  async execute(datasetId: number | string): Promise<PreviewUrl> {
    return await this.datasetsRepository.getPreviewUrl(datasetId)
  }
}
