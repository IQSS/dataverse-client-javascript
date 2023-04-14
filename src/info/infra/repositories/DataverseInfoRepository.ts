import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { IDataverseInfoRepository } from '../../domain/repositories/IDataverseInfoRepository';
import { DataverseVersion } from '../../domain/models/DataverseVersion';
import { AxiosResponse } from 'axios';

export class DataverseInfoRepository extends ApiRepository implements IDataverseInfoRepository {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  public async getDataverseVersion(): Promise<DataverseVersion> {
    return this.doGet('/info/version')
      .then((response) => this.getVersionFromResponse(response))
      .catch((error) => {
        throw error;
      });
  }

  private getVersionFromResponse(response: AxiosResponse): DataverseVersion {
    const responseData = response.data.data;
    return {
      number: responseData.version,
      build: responseData.build,
    };
  }
}
