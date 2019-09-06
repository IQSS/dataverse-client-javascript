import axios, { AxiosResponse } from 'axios'
import { DataverseSearchOptions, SearchOptions } from './@types/searchOptions'

export class DataverseClient {
  private readonly host: string
  private readonly apiToken: string

  public constructor(host: string, apiToken?: string) {
    this.host = host
    this.apiToken = apiToken
  }

  public getDataverseInformation(alias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${alias}` + this.getApiToken()
    return axios.get(url)
  }

  public listDatasets(alias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${alias}/contents` + this.getApiToken()
    return axios.get(url)
  }

  public search(options: SearchOptions): Promise<AxiosResponse> {
    const url = `${this.host}/api/search`
    const requestOptions: DataverseSearchOptions = this.mapSearchOptions(options)
    return axios.get(url, { params: requestOptions })
  }

  public getFile(fileId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/access/datafile/${fileId}` + this.getApiToken()
    return axios.get(url)
  }

  private getApiToken(): string {
    return this.apiToken ? `?key=${this.apiToken}` : ''
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