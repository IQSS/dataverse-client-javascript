import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { GuestbookResponseDTO } from '../../domain/dtos/GuestbookResponseDTO'
import { IAccessRepository } from '../../domain/repositories/IAccessRepository'

export class AccessRepository extends ApiRepository implements IAccessRepository {
  private readonly accessResourceName = 'access'

  public async submitGuestbookForDatafileDownload(
    fileId: number | string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string> {
    const endpoint = this.buildApiEndpoint(`${this.accessResourceName}/datafile`, undefined, fileId)
    const queryParams = format ? { signed: true, format } : { signed: true }

    return this.doPost(endpoint, guestbookResponse, queryParams)
      .then((response) => {
        const signedUrl = response.data.data.signedUrl
        return signedUrl
      })
      .catch((error) => {
        throw error
      })
  }

  public async submitGuestbookForDatafilesDownload(
    fileIds: Array<number>,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string> {
    const queryParams = format ? { signed: true, format } : { signed: true }

    return this.doPost(
      this.buildApiEndpoint(
        this.accessResourceName,
        `datafiles/${Array.isArray(fileIds) ? fileIds.join(',') : fileIds}`
      ),
      guestbookResponse,
      queryParams
    )
      .then((response) => {
        const signedUrl = response.data.data.signedUrl
        return signedUrl
      })
      .catch((error) => {
        throw error
      })
  }

  public async submitGuestbookForDatasetDownload(
    datasetId: number | string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string> {
    const endpoint = this.buildApiEndpoint(
      `${this.accessResourceName}/dataset`,
      undefined,
      datasetId
    )
    const queryParams = format ? { signed: true, format } : { signed: true }

    return this.doPost(endpoint, guestbookResponse, queryParams)
      .then((response) => {
        const signedUrl = response.data.data.signedUrl
        return signedUrl
      })
      .catch((error) => {
        throw error
      })
  }

  public async submitGuestbookForDatasetVersionDownload(
    datasetId: number | string,
    versionId: string,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string> {
    const endpoint = this.buildApiEndpoint(
      `${this.accessResourceName}/dataset`,
      `versions/${versionId}`,
      datasetId
    )
    const queryParams = format ? { signed: true, format } : { signed: true }

    return this.doPost(endpoint, guestbookResponse, queryParams)
      .then((response) => {
        const signedUrl = response.data.data.signedUrl
        return signedUrl
      })
      .catch((error) => {
        throw error
      })
  }
}
