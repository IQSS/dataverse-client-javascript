export class ApiConfig {
  static DATAVERSE_API_URL: string;

  static init(dataverseApiUrl: string) {
    this.DATAVERSE_API_URL = dataverseApiUrl;
  }
}
