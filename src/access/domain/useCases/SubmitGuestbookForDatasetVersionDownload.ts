import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponseDTO } from '../dtos/GuestbookResponseDTO'
import { IAccessRepository } from '../repositories/IAccessRepository'

export class SubmitGuestbookForDatasetVersionDownload implements UseCase<string> {
  constructor(private readonly accessRepository: IAccessRepository) {}

  /**
   * Submits a guestbook response for a specific dataset version download request and returns a signed URL.
   *
   * @param {number | string} datasetId - Dataset identifier (numeric id or persistent id).
   * @param {string} versionId - Dataset version identifier (for example, ':latest' or '1.0').
   * @param {GuestbookResponseDTO} guestbookResponse - Guestbook response payload.
   * @param {string} [format] - Optional download format passed as a query parameter.
   * @returns {Promise<string>} - Signed URL for the download.
   */
  async execute(
    datasetId: number | string,
    versionId: string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string> {
    return await this.accessRepository.submitGuestbookForDatasetVersionDownload(
      datasetId,
      versionId,
      guestbookResponse,
      format
    )
  }
}
