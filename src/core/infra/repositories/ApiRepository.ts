import axios, { AxiosResponse } from 'axios';
import { ReadError } from '../../domain/repositories/ReadError';

export abstract class ApiRepository {
  constructor(private readonly apiUrl: string) {}

  public async doGet(apiEndpoint: string): Promise<AxiosResponse> {
    return await axios
      .get(`${this.apiUrl}${apiEndpoint}`)
      .then((response) => response)
      .catch((error) => {
        throw new ReadError(
          `[${error.response.status}]${error.response.data ? ` ${error.response.data.message}` : ''}`,
        );
      });
  }
}
