import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponseDTO } from '../dtos/GuestbookResponseDTO'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class SubmitGuestbookForDatafileDownload implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Submits a guestbook response for a single datafile download request and returns a signed URL.
   *
   * @param {number | string} fileId - Datafile identifier (numeric id or persistent id).
   * @param {GuestbookResponseDTO} guestbookResponse - Guestbook response payload.
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(
    fileId: number | string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string> {
    return await this.accessRepository.submitGuestbookForDatafileDownload(
      fileId,
      guestbookResponse,
      format
    )
  }
}
