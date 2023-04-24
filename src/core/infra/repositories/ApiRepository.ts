import axios, { AxiosResponse } from 'axios';
import { ApiConfig } from './ApiConfig';
import { ReadError } from '../../domain/repositories/ReadError';
import { WriteError } from '../../domain/repositories/WriteError';

/* TODO: 
  We set { withCredentials: true } to send the JSESSIONID cookie in the requests for API authentication. 
  This is required, along with the session auth feature flag enabled in the backend, to be able to authenticate using the JSESSIONID cookie.
  Auth mechanisms like this must be configurable to set the one that fits the particular use case of js-dataverse. (For the SPA MVP, it is the session cookie API auth).
  For 2.0.0, we must also support API key auth to be backwards compatible and support use cases other than SPA MVP.
*/
export abstract class ApiRepository {
  public async doGet(apiEndpoint: string): Promise<AxiosResponse> {
    return await axios
      .get(this.buildRequestUrl(apiEndpoint), { withCredentials: true })
      .then((response) => response)
      .catch((error) => {
        throw new ReadError(
          `[${error.response.status}]${error.response.data ? ` ${error.response.data.message}` : ''}`,
        );
      });
  }

  public async doPost(apiEndpoint: string, data: string | object): Promise<AxiosResponse> {
    return await axios
      .post(this.buildRequestUrl(apiEndpoint), JSON.stringify(data), { withCredentials: true })
      .then((response) => response)
      .catch((error) => {
        throw new WriteError(
          `[${error.response.status}]${error.response.data ? ` ${error.response.data.message}` : ''}`,
        );
      });
  }

  private buildRequestUrl(apiEndpoint: string): string {
    return `${ApiConfig.DATAVERSE_API_URL}${apiEndpoint}`;
  }
}
