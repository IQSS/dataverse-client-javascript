import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponseDTO } from '../dtos/GuestbookResponseDTO'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class SubmitGuestbookForDatasetDownload implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Submits a guestbook response for dataset download request and returns a signed URL.
   *
   * @param {number | string} datasetId - Dataset identifier (numeric id or persistent id).
   * @param {GuestbookResponseDTO} guestbookResponse - Guestbook response payload.
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(
    datasetId: number | string,
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string> {
    return await this.accessRepository.submitGuestbookForDatasetDownload(
      datasetId,
      guestbookResponse
    )
  }
}
