import axios, { AxiosResponse } from 'axios';
import { ReadError } from '../../domain/repositories/ReadError';

export abstract class ApiRepository {
  constructor(private readonly apiUrl: string) {}

  public async doGet(apiEndpoint: string): Promise<AxiosResponse> {
    return await axios
      /* TODO: 
        We set { withCredentials: true } to send the JSESSIONID cookie in the request for API authentication. 
        This is required, along with the session auth feature flag enabled in the backend, to be able to authenticate using the JSESSIONID cookie.
        Auth mechanisms like this must be configurable to set the one that fits the particular use case of js-dataverse. (For the SPA MVP, it is the session cookie API auth).
        For 2.0.0, we must also support API key auth to be backwards compatible and support use cases other than SPA MVP.
      */
      .get(`${this.apiUrl}${apiEndpoint}`, { withCredentials: true })
      .then((response) => response)
      .catch((error) => {
        throw new ReadError(
          `[${error.response.status}]${error.response.data ? ` ${error.response.data.message}` : ''}`,
        );
      });
  }
}
