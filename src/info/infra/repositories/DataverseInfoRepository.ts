import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IDataverseInfoRepository } from '../../domain/repositories/IDataverseInfoRepository'
import { DataverseVersion } from '../../domain/models/DataverseVersion'
import { AxiosResponse } from 'axios'

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
      .then((response) => response.data.data as number)
      .catch((error) => {
        throw error
      })
  }

  public async getMaxEmbargoDurationInMonths(): Promise<number> {
    return this.doGet(
      this.buildApiEndpoint(this.infoResourceName, `settings/:MaxEmbargoDurationInMonths`)
    )
      .then((response) => response.data.data.message as number)
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
}
