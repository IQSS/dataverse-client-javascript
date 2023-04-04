import { IDataverseInfoRepository } from '../../domain/repositories/IDataverseInfoRepository';
import axios, { AxiosResponse } from 'axios';
import { ReadError } from '../../../core/domain/repositories/ReadError';

export class DataverseInfoRepository implements IDataverseInfoRepository {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getDataverseVersion(): Promise<string> {
    const response = await axios.get(`${this.apiUrl}/info/version`).catch((error) => {
      throw new ReadError(error.response.status + error.response.data ? ': ' + error.response.data.message : '');
    });
    return this.getVersionFromResponse(response);
  }

  private getVersionFromResponse(response: AxiosResponse): string {
    return response.data.data.version;
  }
}
