import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class GetSignedDatasetVersionDownloadUrl implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Returns a signed URL for downloading all files in a specific dataset version.
   *
   * @param {number | string} datasetId - Dataset identifier (numeric id or persistent id).
   * @param {string} versionId - Dataset version id.
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(datasetId: number | string, versionId: string): Promise<string> {
    return await this.accessRepository.getSignedDatasetVersionDownloadUrl(datasetId, versionId)
  }
}
