import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ApiConfig, DataverseApiAuthMechanism } from './ApiConfig'
import { ReadError } from '../../domain/repositories/ReadError'
import { WriteError } from '../../domain/repositories/WriteError'

export abstract class ApiRepository {
  public async doGet(
    apiEndpoint: string,
    authRequired = false,
    queryParams: object = {}
  ): Promise<AxiosResponse> {
    return await axios
      .get(this.buildRequestUrl(apiEndpoint), this.buildRequestConfig(authRequired, queryParams))
      .then((response) => response)
      .catch((error) => {
        throw new ReadError(
          `[${error.response.status}]${
            error.response.data ? ` ${error.response.data.message}` : ''
          }`
        )
      })
  }

  public async doPost(
    apiEndpoint: string,
    data: string | object,
    queryParams: object = {}
  ): Promise<AxiosResponse> {
    return await axios
      .post(
        this.buildRequestUrl(apiEndpoint),
        JSON.stringify(data),
        this.buildRequestConfig(true, queryParams)
      )
      .then((response) => response)
      .catch((error) => {
        throw new WriteError(
          `[${error.response.status}]${
            error.response.data ? ` ${error.response.data.message}` : ''
          }`
        )
      })
  }

  protected buildApiEndpoint(
    resourceName: string,
    operation: string,
    resourceId: number | string = undefined
  ) {
    if (resourceName === 'dataverses') {
      return `/${resourceName}/${resourceId}`
    }

    return typeof resourceId === 'number'
      ? `/${resourceName}/${resourceId}/${operation}`
      : typeof resourceId === 'string'
      ? `/${resourceName}/:persistentId/${operation}?persistentId=${resourceId}`
      : `/${resourceName}/${operation}`
  }

  private buildRequestConfig(authRequired: boolean, queryParams: object): AxiosRequestConfig {
    const requestConfig: AxiosRequestConfig = {
      params: queryParams,
      headers: { 'Content-Type': 'application/json' }
    }
    if (!authRequired) {
      return requestConfig
    }
    switch (ApiConfig.dataverseApiAuthMechanism) {
      case DataverseApiAuthMechanism.SESSION_COOKIE:
        /*
          We set { withCredentials: true } to send the JSESSIONID cookie in the requests for API authentication.
          This is required, along with the session auth feature flag enabled in the backend, to be able to authenticate using the JSESSIONID cookie.
          Auth mechanisms like this are configurable to set the one that fits the particular use case of js-dataverse. (For the SPA MVP, it is the session cookie API auth).
        */
        requestConfig.withCredentials = true
        break
      case DataverseApiAuthMechanism.API_KEY:
        if (typeof ApiConfig.dataverseApiKey !== 'undefined') {
          requestConfig.headers['X-Dataverse-Key'] = ApiConfig.dataverseApiKey
        }
        break
    }
    return requestConfig
  }

  private buildRequestUrl(apiEndpoint: string): string {
    return `${ApiConfig.dataverseApiUrl}${apiEndpoint}`
  }
}
