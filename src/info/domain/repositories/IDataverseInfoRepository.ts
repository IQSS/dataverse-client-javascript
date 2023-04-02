export interface IDataverseInfoRepository {
  getDataverseVersion(): Promise<string>;
}
