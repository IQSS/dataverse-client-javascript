import axios, { AxiosResponse } from 'axios'

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

  private getApiToken(): string {
    return this.apiToken ? `?key=${this.apiToken}` : ''
  }
}