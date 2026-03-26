import { GuestbookResponseDTO } from '../dtos/GuestbookResponseDTO'

export interface IAccessRepository {
  submitGuestbookForDatafileDownload(
    fileId: number | string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string>

  submitGuestbookForDatafilesDownload(
    fileIds: string | Array<number | string>,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string>

  submitGuestbookForDatasetDownload(
    datasetId: number | string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string>

  submitGuestbookForDatasetVersionDownload(
    datasetId: number | string,
    versionId: string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string>
}
