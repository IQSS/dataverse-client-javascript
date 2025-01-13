import { AxiosRequestConfig } from 'axios'
import { ApiConfig, DataverseApiAuthMechanism } from './ApiConfig'
import { ApiConstants } from './ApiConstants'

export const buildRequestConfig = (
  authRequired: boolean,
  queryParams: object | URLSearchParams,
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

  // When using multipart/form-data for axios to work properly its better to avoid setting the content-type and let the browser manage it
  if (contentType === ApiConstants.CONTENT_TYPE_MULTIPART_FORM_DATA) {
    requestConfig.headers['Content-Type'] = undefined
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

    case DataverseApiAuthMechanism.BEARER_TOKEN: {
      if (!ApiConfig.bearerTokenLocalStorageKey) {
        throw new Error(
          'Bearer token local storage key is not set in the ApiConfig, when using bearer token auth mechanism you must set the bearerTokenLocalStorageKey'
        )
      }

      const token = getLocalStorageItem<string>(ApiConfig.bearerTokenLocalStorageKey)

      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`
      }
      break
    }
  }
  return requestConfig
}

export const buildRequestUrl = (apiEndpoint: string): string => {
  return `${ApiConfig.dataverseApiUrl}${apiEndpoint}`
}

export const getLocalStorageItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error)
    return null
  }
}
