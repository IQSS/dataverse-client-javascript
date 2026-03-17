import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { GuestbookResponseDTO } from '../../domain/dtos/GuestbookResponseDTO'
import { IAccessRepository } from '../../domain/repositories/IAccessRepository'

export class AccessRepository extends ApiRepository implements IAccessRepository {
  private readonly accessResourceName = 'access'

  public async submitGuestbookForDatafileDownload(
    fileId: number | string,
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string> {
    const endpoint = this.buildApiEndpoint(`${this.accessResourceName}/datafile`, undefined, fileId)
    return this.doPost(endpoint, guestbookResponse, { signed: true })
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
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string> {
    return this.doPost(
      this.buildApiEndpoint(
        this.accessResourceName,
        `datafiles/${Array.isArray(fileIds) ? fileIds.join(',') : fileIds}`
      ),
      guestbookResponse,
      { signed: true }
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
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string> {
    const endpoint = this.buildApiEndpoint(
      `${this.accessResourceName}/dataset`,
      undefined,
      datasetId
    )
    return this.doPost(endpoint, guestbookResponse, { signed: true })
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
    guestbookResponse: GuestbookResponseDTO
  ): Promise<string> {
    const endpoint = this.buildApiEndpoint(
      `${this.accessResourceName}/dataset`,
      `versions/${versionId}`,
      datasetId
    )
    return this.doPost(endpoint, guestbookResponse, { signed: true })
      .then((response) => {
        const signedUrl = response.data.data.signedUrl
        return signedUrl
      })
      .catch((error) => {
        throw error
      })
  }
}
