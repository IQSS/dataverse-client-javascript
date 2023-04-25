import { DataverseVersion } from '../models/DataverseVersion';

export interface IDataverseInfoRepository {
  getDataverseVersion(): Promise<DataverseVersion>;
}
