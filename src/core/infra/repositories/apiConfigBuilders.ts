import { AxiosRequestConfig } from 'axios'
import { ApiConfig, DataverseApiAuthMechanism } from './ApiConfig'
import { ApiConstants } from './ApiConstants'

export const buildRequestConfig = (
  authRequired: boolean,
  queryParams: object,
  contentType: string = ApiConstants.CONTENT_TYPE_APPLICATION_JSON,
  abortSignal?: AbortSignal
): AxiosRequestConfig => {
  const requestConfig: AxiosRequestConfig = {
    params: queryParams,
    headers: {
      'Content-Type': contentType
    },
    ...(abortSignal && { signal: abortSignal })
  }
  if (!authRequired) {
    return requestConfig
  }
  switch (ApiConfig.dataverseApiAuthMechanism) {
    case DataverseApiAuthMechanism.SESSION_COOKIE:
      /*
        We set { withCredentials: true } to send the JSESSIONID cookie in the requests for API authentication.
        This is required, along with the session auth feature flag enabled in the backend, to be able to authenticate using the JSESSIONID cookie.
        Auth mechanisms like this are configurable to set the one that fits the particular use case of js-dataverse. (For the SPA MVP, it is the session cookie API auth).
      */
      requestConfig.withCredentials = true
      break
    case DataverseApiAuthMechanism.API_KEY:
      if (typeof ApiConfig.dataverseApiKey !== 'undefined') {
        requestConfig.headers['X-Dataverse-Key'] = ApiConfig.dataverseApiKey
      }
      break
    case DataverseApiAuthMechanism.BEARER_TOKEN:
      // TODO: ROCP_token name should be configurable and extracted to an environment variable / application constant.
      let token = localStorage.getItem('ROCP_token')
      if (token) {
        token = token.replace(/^"(.*)"$/, '$1')
        requestConfig.headers['Authorization'] = 'Bearer ' + token
      }
      requestConfig.withCredentials = false
      break
  }
  return requestConfig
}

export const buildRequestUrl = (apiEndpoint: string): string => {
  return `${ApiConfig.dataverseApiUrl}${apiEndpoint}`
}
