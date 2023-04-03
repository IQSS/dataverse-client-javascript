import { IDataverseInfoRepository } from '../../domain/repositories/IDataverseInfoRepository';
import axios, { AxiosResponse } from 'axios';
import { ReadError } from '../../../core/domain/repositories/ReadError';

export class DataverseInfoRepository implements IDataverseInfoRepository {
  public async getDataverseVersion(): Promise<string> {
    const response = await axios.get('https://demo.dataverse.org/api/v1/info/version').catch((error) => {
      throw new ReadError(error.response.status + error.response.data ? ': ' + error.response.data.message : '');
    });
    return this.getVersionFromResponse(response);
  }

  private getVersionFromResponse(response: AxiosResponse): string {
    return response.data.data.version;
  }
}
