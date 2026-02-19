import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponseDTO } from '../dtos/GuestbookResponseDTO'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class SubmitGuestbookForDatafilesDownload implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Submits a guestbook response for multiple datafiles download request and returns a signed URL.
   *
   * @param {string | Array<number | string>} fileIds - Comma-separated string or array of file ids.
   * @param {GuestbookResponseDTO} guestbookResponse - Guestbook response payload.
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(
    fileIds: string | Array<number | string>,
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string> {
    return await this.accessRepository.submitGuestbookForDatafilesDownload(
      fileIds,
      guestbookResponse
    )
  }
}
