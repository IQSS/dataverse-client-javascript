import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IDataverseInfoRepository } from '../../domain/repositories/IDataverseInfoRepository'
import { DataverseVersion } from '../../domain/models/DataverseVersion'
import { AxiosResponse } from 'axios'
import { DatasetMetadataExportFormats } from '../../domain/models/DatasetMetadataExportFormats'

export class DataverseInfoRepository extends ApiRepository implements IDataverseInfoRepository {
  private readonly infoResourceName: string = 'info'

  public async getDataverseVersion(): Promise<DataverseVersion> {
    return this.doGet(this.buildApiEndpoint(this.infoResourceName, `version`))
      .then((response) => this.getVersionFromResponse(response))
      .catch((error) => {
        throw error
      })
  }

  public async getZipDownloadLimit(): Promise<number> {
    return this.doGet(this.buildApiEndpoint(this.infoResourceName, `zipDownloadLimit`))
      .then((response) => parseInt(response.data.data))
      .catch((error) => {
        throw error
      })
  }

  public async getMaxEmbargoDurationInMonths(): Promise<number> {
    return this.doGet(
      this.buildApiEndpoint(this.infoResourceName, `settings/:MaxEmbargoDurationInMonths`)
    )
      .then((response) => parseInt(response.data.data.message))
      .catch((error) => {
        throw error
      })
  }

  private getVersionFromResponse(response: AxiosResponse): DataverseVersion {
    const responseData = response.data.data
    return {
      number: responseData.version,
      build: responseData.build
    }
  }

  public async getApplicationTermsOfUse(lang?: string): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(this.infoResourceName, `applicationTermsOfUse`),
      false,
      {
        ...(lang ? { lang } : {})
      }
    )
      .then((response: AxiosResponse<{ data: { message: string } }>) => {
        return response.data.data.message
      })
      .catch((error) => {
        throw error
      })
  }

  public async getAvailableDatasetMetadataExportFormats(): Promise<DatasetMetadataExportFormats> {
    return this.doGet(this.buildApiEndpoint(this.infoResourceName, `exportFormats`))
      .then((response: AxiosResponse<{ data: DatasetMetadataExportFormats }>) => {
        return response.data.data
      })
      .catch((error) => {
        throw error
      })
  }
  public async getDatasetPublishPopupCustomText(): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(this.infoResourceName, `settings/:DatasetPublishPopupCustomText`)
    )
      .then((response: AxiosResponse<{ data: { message: string } }>) => {
        return response.data.data.message
      })
      .catch((error) => {
        throw error
      })
  }
  public async getPublishDatasetDisclaimerText(): Promise<string> {
    return this.doGet(
      this.buildApiEndpoint(this.infoResourceName, `settings/:PublishDatasetDisclaimerText`)
    )
      .then((response: AxiosResponse<{ data: { message: string } }>) => {
        return response.data.data.message
      })
      .catch((error) => {
        throw error
      })
  }
}
