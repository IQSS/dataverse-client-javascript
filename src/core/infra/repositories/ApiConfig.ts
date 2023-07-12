export class ApiConfig {
  static dataverseApiUrl: string;
  static dataverseApiAuthMechanism: DataverseApiAuthMechanism;
  static dataverseApiKey?: string;

  static init(dataverseApiUrl: string, dataverseApiAuthMechanism: DataverseApiAuthMechanism, dataverseApiKey?: string) {
    this.dataverseApiUrl = dataverseApiUrl;
    this.dataverseApiAuthMechanism = dataverseApiAuthMechanism;
    this.dataverseApiKey = dataverseApiKey;
  }
}

export enum DataverseApiAuthMechanism {
  API_KEY = 'api-key',
  SESSION_COOKIE = 'session-cookie', // Temporal and only for dev purposes
}
