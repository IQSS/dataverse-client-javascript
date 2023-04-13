import { IDataverseInfoRepository } from '../../domain/repositories/IDataverseInfoRepository';
import axios, { AxiosResponse } from 'axios';
import { ReadError } from '../../../core/domain/repositories/ReadError';
import { DataverseVersion } from '../../domain/models/DataverseVersion';

export class DataverseInfoRepository implements IDataverseInfoRepository {
  constructor(private readonly apiUrl: string) {}

  public async getDataverseVersion(): Promise<DataverseVersion> {
    let datasetVersion;
    await axios
      .get(`${this.apiUrl}/info/version`)
      .then((response) => {
        datasetVersion = this.getVersionFromResponse(response);
      })
      .catch((error) => {
        throw new ReadError(error.response.status + error.response.data ? ': ' + error.response.data.message : '');
      });
    return datasetVersion;
  }

  private getVersionFromResponse(response: AxiosResponse): DataverseVersion {
    const responseData = response.data.data;
    return {
      number: responseData.version,
      build: responseData.build,
    };
  }
}
