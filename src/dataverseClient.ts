import axios, { AxiosResponse } from 'axios'
import { DataverseSearchOptions, SearchOptions } from './@types/searchOptions'
import { DataverseHeaders } from './@types/dataverseHeaders'

export class DataverseClient {
  private readonly host: string
  private readonly apiToken: string

  public constructor(host: string, apiToken?: string) {
    this.host = host
    this.apiToken = apiToken
  }

  public getDataverseInformation(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}`
    return axios.get(url, { headers: this.getHeaders() })
  }

  public listDatasets(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}/contents`
    return axios.get(url, { headers: this.getHeaders() })
  }

  public search(options: SearchOptions): Promise<AxiosResponse> {
    const url = `${this.host}/api/search`
    const requestOptions: DataverseSearchOptions = this.mapSearchOptions(options)
    return axios.get(url, { params: requestOptions })
  }

  public getFile(fileId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/access/datafile/${fileId}`
    return axios.get(url, { headers: this.getHeaders() })
  }

  public getFileMetadata(fileId: string, draftVersion = false): Promise<AxiosResponse> {
    const url = `${this.host}/api/files/${fileId}/metadata/${draftVersion ? 'draft' : ''}`
    return axios.get(url, { headers: this.getHeaders() })
  }

  public getDatasetInformation(datasetId: string, datasetVersion: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/datasets/${datasetId}/versions/${datasetVersion}`
    return axios.get(url, { headers: this.getHeaders() })
  }

  public listDataverseRoleAssignments(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}/assignments`
    return axios.get(url, { headers: this.getHeaders() })
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