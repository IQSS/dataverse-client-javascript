import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiConfig, DataverseApiAuthMechanism } from './ApiConfig';
import { ReadError } from '../../domain/repositories/ReadError';
import { WriteError } from '../../domain/repositories/WriteError';

export abstract class ApiRepository {
  public async doGet(apiEndpoint: string, authRequired = false): Promise<AxiosResponse> {
    return await axios
      .get(this.buildRequestUrl(apiEndpoint), this.buildRequestConfig(authRequired))
      .then((response) => response)
      .catch((error) => {
        throw new ReadError(
          `[${error.response.status}]${error.response.data ? ` ${error.response.data.message}` : ''}`,
        );
      });
  }

  public async doPost(apiEndpoint: string, data: string | object): Promise<AxiosResponse> {
    return await axios
      .post(this.buildRequestUrl(apiEndpoint), JSON.stringify(data), this.buildRequestConfig(true))
      .then((response) => response)
      .catch((error) => {
        throw new WriteError(
          `[${error.response.status}]${error.response.data ? ` ${error.response.data.message}` : ''}`,
        );
      });
  }

  private buildRequestConfig(authRequired: boolean): AxiosRequestConfig {
    let requestConfig: AxiosRequestConfig = {
      headers: { 'Content-Type': 'application/json' },
    };
    if (!authRequired) {
      return requestConfig;
    }
    switch (ApiConfig.dataverseApiAuthMechanism) {
      case DataverseApiAuthMechanism.SESSION_COOKIE:
        /*
          We set { withCredentials: true } to send the JSESSIONID cookie in the requests for API authentication. 
          This is required, along with the session auth feature flag enabled in the backend, to be able to authenticate using the JSESSIONID cookie.
          Auth mechanisms like this are configurable to set the one that fits the particular use case of js-dataverse. (For the SPA MVP, it is the session cookie API auth).
        */
        requestConfig.withCredentials = true;
      case DataverseApiAuthMechanism.API_KEY:
        requestConfig.headers['X-Dataverse-Key'] = ApiConfig.dataverseApiKey;
    }
    return requestConfig;
  }

  private buildRequestUrl(apiEndpoint: string): string {
    return `${ApiConfig.dataverseApiUrl}${apiEndpoint}`;
  }
}
