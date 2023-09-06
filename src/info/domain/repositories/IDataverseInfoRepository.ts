import { DataverseVersion } from '../models/DataverseVersion';

export interface IDataverseInfoRepository {
  getDataverseVersion(): Promise<DataverseVersion>;
  getZipDownloadLimit(): Promise<number>;
}
