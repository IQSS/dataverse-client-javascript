export class ApiConfig {
  static dataverseApiUrl: string
  static dataverseApiAuthMechanism: DataverseApiAuthMechanism
  static dataverseApiKey?: string
  static bearerTokenLocalStorageKey?: string
  static bearerTokenGetFunction?: () => string | null

  static init(
    dataverseApiUrl: string,
    dataverseApiAuthMechanism: DataverseApiAuthMechanism,
    dataverseApiKey?: string,
    bearerTokenLocalStorageKey?: string,
    bearerTokenGetFunction?: () => string
  ) {
    this.dataverseApiUrl = dataverseApiUrl
    this.dataverseApiAuthMechanism = dataverseApiAuthMechanism
    this.dataverseApiKey = dataverseApiKey
    this.bearerTokenLocalStorageKey = bearerTokenLocalStorageKey
    this.bearerTokenGetFunction = bearerTokenGetFunction
  }
}

export enum DataverseApiAuthMechanism {
  API_KEY = 'api-key',
  SESSION_COOKIE = 'session-cookie', // Temporal and only for dev purposes
  BEARER_TOKEN = 'bearer-token'
}
