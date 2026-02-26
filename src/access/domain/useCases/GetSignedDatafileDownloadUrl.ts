import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class GetSignedDatafileDownloadUrl implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Returns a signed URL for downloading a single datafile.
   *
   * @param {number | string} fileId - Datafile identifier (numeric id or persistent id).
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(fileId: number | string): Promise<string> {
    return await this.accessRepository.getSignedDatafileDownloadUrl(fileId)
  }
}
