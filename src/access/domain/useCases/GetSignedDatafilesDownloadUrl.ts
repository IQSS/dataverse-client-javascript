import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class GetSignedDatafilesDownloadUrl implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Returns a signed URL for downloading multiple datafiles.
   *
   * @param {string | Array<number | string>} fileIds - Comma-separated ids or array of datafile ids.
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(fileIds: string | Array<number | string>): Promise<string> {
    return await this.accessRepository.getSignedDatafilesDownloadUrl(fileIds)
  }
}
