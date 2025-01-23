export class ApiConfig {
  static dataverseApiUrl: string
  static dataverseApiAuthMechanism: DataverseApiAuthMechanism
  static dataverseApiKey?: string
  static bearerTokenLocalStorageKey?: string

  static init(
    dataverseApiUrl: string,
    dataverseApiAuthMechanism: DataverseApiAuthMechanism,
    dataverseApiKey?: string,
    bearerTokenLocalStorageKey?: string
  ) {
    this.dataverseApiUrl = dataverseApiUrl
    this.dataverseApiAuthMechanism = dataverseApiAuthMechanism
    this.dataverseApiKey = dataverseApiKey
    this.bearerTokenLocalStorageKey = bearerTokenLocalStorageKey
  }
}

export enum DataverseApiAuthMechanism {
  API_KEY = 'api-key',
  SESSION_COOKIE = 'session-cookie', // Temporal and only for dev purposes
  BEARER_TOKEN = 'bearer-token'
}
