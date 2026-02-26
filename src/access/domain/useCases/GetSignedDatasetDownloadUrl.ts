import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class GetSignedDatasetDownloadUrl implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Returns a signed URL for downloading all files in a dataset.
   *
   * @param {number | string} datasetId - Dataset identifier (numeric id or persistent id).
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(datasetId: number | string): Promise<string> {
    return await this.accessRepository.getSignedDatasetDownloadUrl(datasetId)
  }
}
