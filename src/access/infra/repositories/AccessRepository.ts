import { ApiConfig, DataverseApiAuthMechanism } from '../../../core/infra/repositories/ApiConfig'
import { WriteError } from '../../../core/domain/repositories/WriteError'
import { ApiConstants } from '../../../core/infra/repositories/ApiConstants'
import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import {
  buildRequestConfig,
  buildRequestUrl
} from '../../../core/infra/repositories/apiConfigBuilders'
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

    return await this.submitGuestbookDownload(endpoint, guestbookResponse, queryParams)
  }

  public async submitGuestbookForDatafilesDownload(
    fileIds: Array<number>,
    guestbookResponse: GuestbookResponseDTO,
    format?: string
  ): Promise<string> {
    const queryParams = format ? { signed: true, format } : { signed: true }

    return await this.submitGuestbookDownload(
      this.buildApiEndpoint(
        this.accessResourceName,
        `datafiles/${Array.isArray(fileIds) ? fileIds.join(',') : fileIds}`
      ),
      guestbookResponse,
      queryParams
    )
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

    return await this.submitGuestbookDownload(endpoint, guestbookResponse, queryParams)
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

    return await this.submitGuestbookDownload(endpoint, guestbookResponse, queryParams)
  }

  private async submitGuestbookDownload(
    apiEndpoint: string,
    guestbookResponse: GuestbookResponseDTO,
    queryParams: object
  ): Promise<string> {
    const requestConfig = buildRequestConfig(
      true,
      queryParams,
      ApiConstants.CONTENT_TYPE_APPLICATION_JSON
    )
    const response = await fetch(
      this.buildUrlWithQueryParams(buildRequestUrl(apiEndpoint), queryParams),
      {
        method: 'POST',
        headers: this.buildFetchHeaders(requestConfig.headers),
        credentials: this.getFetchCredentials(requestConfig.withCredentials),
        body: JSON.stringify(guestbookResponse)
      }
    ).catch((error) => {
      throw new WriteError(error instanceof Error ? error.message : String(error))
    })

    const responseData = await this.parseResponseBody(response)

    if (!response.ok) {
      throw new WriteError(this.buildFetchErrorMessage(response.status, responseData))
    }

    return responseData.data.signedUrl as string
  }

  private getFetchCredentials(withCredentials?: boolean): RequestCredentials | undefined {
    if (ApiConfig.dataverseApiAuthMechanism === DataverseApiAuthMechanism.BEARER_TOKEN) {
      return 'omit'
    }

    if (withCredentials) {
      return 'include'
    }

    return undefined
  }

  private buildUrlWithQueryParams(requestUrl: string, queryParams: object): string {
    const url = new URL(requestUrl)

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })

    return url.toString()
  }

  private buildFetchHeaders(headers?: Record<string, unknown>): Record<string, string> {
    const fetchHeaders: Record<string, string> = {}

    if (!headers) {
      return fetchHeaders
    }

    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        fetchHeaders[key] = String(value)
      }
    })

    return fetchHeaders
  }

  private async parseResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      return await response.json()
    }

    return await response.text()
  }

  private buildFetchErrorMessage(status: number, responseData: any): string {
    const message =
      typeof responseData === 'string'
        ? responseData
        : responseData?.message || responseData?.data?.message || 'unknown error'

    return `[${status}] ${message}`
  }
}
