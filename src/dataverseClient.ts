import axios, { AxiosResponse, ResponseType } from 'axios'
import { DataverseSearchOptions, SearchOptions } from './@types/searchOptions'
import { DataverseHeaders } from './@types/dataverseHeaders'
import { DataverseException } from './exceptions/dataverseException'
import { DataverseMetricType } from './@types/dataverseMetricType'
const request = require('request-promise')

export class DataverseClient {
  private readonly host: string
  private readonly apiToken: string

  public constructor(host: string, apiToken?: string) {
    this.host = host
    this.apiToken = apiToken
  }

  public async getDataverseInformation(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}`
    return this.getRequest(url)
  }

  public async listDatasets(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}/contents`
    return this.getRequest(url)
  }

  public async addDataset(dataverseAlias: string, payload: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}/datasets`
    return this.postRequest(url, payload)
  }

  public async search(options: SearchOptions): Promise<AxiosResponse> {
    const url = `${this.host}/api/search`
    const requestOptions: DataverseSearchOptions = this.mapSearchOptions(options)
    return this.getRequest(url, { params: requestOptions })
  }

  public async getFile(fileId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/access/datafile/${fileId}`
    return this.getRequest(url, {
      headers: this.getHeaders(),
      responseType: 'arraybuffer'
    })
  }

  public async getFileMetadata(fileId: string, draftVersion = false): Promise<AxiosResponse> {
    const url = `${this.host}/api/files/${fileId}/metadata/${draftVersion ? 'draft' : ''}`
    return this.getRequest(url)
  }

  public async getLatestDatasetInformation(datasetId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/datasets/${datasetId}`
    return this.getRequest(url)
  }

  public async getDatasetVersions(datasetId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/datasets/${datasetId}/versions`
    return this.getRequest(url)
  }

  public async getDatasetVersion(datasetId: string, version: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/datasets/${datasetId}/versions/${version}`
    return this.getRequest(url)
  }

  public async getDatasetThumbnail(datasetId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/datasets/${datasetId}/thumbnail`
    return this.getRequest(url, {
      headers: this.getHeaders(),
      responseType: 'arraybuffer'
    })
  }

  public async uploadDatasetThumbnail(datasetId: string, image: object): Promise<any> {
    const url = `${this.host}/api/datasets/${datasetId}/thumbnail`
    const options = {
      url: url,
      headers: this.getHeaders(),
      formData: {
        file: image
      },
      resolveWithFullResponse: true
    }

    return await request.post(options)
  }

  public async listDataverseRoleAssignments(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}/assignments`
    return this.getRequest(url)
  }

  public async listDataverseGroups(dataverseId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseId}/groups`
    return this.getRequest(url)
  }

  public async getMetric(datasetId: string, metricType: DataverseMetricType, yearMonth?: string): Promise<AxiosResponse> {
    return this.getMetricByCountry(datasetId, metricType, undefined, yearMonth)
  }

  public async getMetricByCountry(datasetId: string, metricType: DataverseMetricType, countryCode?: string, yearMonth?: string) {
    const countryQueryParam = countryCode ? `?country=${countryCode}` : ''
    const url = `${this.host}/api/datasets/${datasetId}/makeDataCount/${metricType.toString()}${yearMonth ? '/' + yearMonth : ''}${countryQueryParam}`
    return this.getRequest(url)
  }

  private async getRequest(url: string, options: { params?: object, headers?: DataverseHeaders, responseType?: ResponseType } = { headers: this.getHeaders() }): Promise<AxiosResponse> {
    return await axios.get(url, options).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  private async postRequest(url: string, data: string | object, options: { params?: object, headers?: any } = { headers: this.getHeaders() }) {
    return await axios.post(url, data, options).catch(error => {
      console.log(error)
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  private getHeaders(): DataverseHeaders {
    return {
      'X-Dataverse-key': this.apiToken ? this.apiToken : ''
    }
  }

  private mapSearchOptions(options: SearchOptions): DataverseSearchOptions {
    return {
      q: options.query,
      subtree: options.dataverseAlias,
      start: options.startPosition,
      type: options.type,
      sort: options.sortAttribute,
      order: options.order,
      'per_page': options.itemsPerPage,
      'show_entity_ids': options.showEntityIds,
      'show_relevance': options.showRelevance
    }
  }
}