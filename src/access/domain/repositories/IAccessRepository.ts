import { GuestbookResponseDTO } from '../dtos/GuestbookResponseDTO'

export interface IAccessRepository {
  getSignedDatafileDownloadUrl(fileId: number | string): Promise<string>

  getSignedDatafilesDownloadUrl(fileIds: string | Array<number | string>): Promise<string>

  getSignedDatasetDownloadUrl(datasetId: number | string): Promise<string>

  getSignedDatasetVersionDownloadUrl(datasetId: number | string, versionId: string): Promise<string>

  submitGuestbookForDatafileDownload(
    fileId: number | string,
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string>

  submitGuestbookForDatafilesDownload(
    fileIds: string | Array<number | string>,
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string>

  submitGuestbookForDatasetDownload(
    datasetId: number | string,
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string>

  submitGuestbookForDatasetVersionDownload(
    datasetId: number | string,
    versionId: string,
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string>
}
