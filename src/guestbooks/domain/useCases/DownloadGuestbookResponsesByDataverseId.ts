import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class DownloadGuestbookResponsesByDataverseId implements UseCase<string> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Downloads all guestbook responses for a dataverse collection.
   *
   * The dataverse can be identified by either its alias/identifier or numeric database id.
   * The returned string is the raw response body from the Dataverse API, which is typically
   * saved by callers as a CSV file or printed directly.
   *
   * @param {number | string} dataverseId - Dataverse alias/identifier or numeric database id.
   * @returns {Promise<string>} Raw response body returned by the Dataverse API.
   */
  async execute(dataverseId: number | string): Promise<string> {
    return await this.guestbooksRepository.downloadGuestbookResponsesByDataverseId(dataverseId)
  }
}
