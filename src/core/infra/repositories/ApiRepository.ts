import axios, { AxiosResponse } from 'axios'
import { ReadError } from '../../domain/repositories/ReadError'
import { WriteError } from '../../domain/repositories/WriteError'
import { buildRequestConfig, buildRequestUrl } from './apiConfigBuilders'
import { ApiConstants } from './ApiConstants'

export abstract class ApiRepository {
  public async doGet(
    apiEndpoint: string,
    authRequired = false,
    queryParams: object = {}
  ): Promise<AxiosResponse> {
    return await axios
      .get(buildRequestUrl(apiEndpoint), buildRequestConfig(authRequired, queryParams))
      .then((response) => response)
      .catch((error) => {
        throw new ReadError(this.buildErrorMessage(error))
      })
  }

  public async doPost(
    apiEndpoint: string,
    data: string | object,
    queryParams: object = {},
    contentType: string = ApiConstants.CONTENT_TYPE_APPLICATION_JSON
  ): Promise<AxiosResponse> {
    return await this.doRequest('post', apiEndpoint, data, queryParams, contentType)
  }

  public async doPut(
    apiEndpoint: string,
    data: string | object,
    queryParams: object = {}
  ): Promise<AxiosResponse> {
    return await this.doRequest('put', apiEndpoint, data, queryParams)
  }

  protected buildApiEndpoint(
    resourceName: string,
    operation: string,
    resourceId: number | string = undefined
  ) {
    return typeof resourceId === 'number'
      ? `/${resourceName}/${resourceId}/${operation}`
      : typeof resourceId === 'string'
      ? `/${resourceName}/:persistentId/${operation}?persistentId=${resourceId}`
      : `/${resourceName}/${operation}`
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private buildErrorMessage(error: any): string {
    const status =
      error.response && error.response.status ? error.response.status : 'unknown error status'
    const message = error.response && error.response.data ? ` ${error.response.data.message}` : ''
    return `[${status}]${message}`
  }

  private async doRequest(
    method: 'post' | 'put',
    apiEndpoint: string,
    data: string | object,
    queryParams: object = {},
    contentType: string = ApiConstants.CONTENT_TYPE_APPLICATION_JSON
  ): Promise<AxiosResponse> {
    const requestData =
      contentType == ApiConstants.CONTENT_TYPE_APPLICATION_JSON ? JSON.stringify(data) : data
    const requestUrl = buildRequestUrl(apiEndpoint)
    const requestConfig = buildRequestConfig(true, queryParams, contentType)

    try {
      const response = await axios[method](requestUrl, requestData, requestConfig)
      return response
    } catch (error) {
      throw new WriteError(this.buildErrorMessage(error))
    }
  }
}
