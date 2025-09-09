import { DatasetMetadataExportFormats } from '../models/DatasetMetadataExportFormats'
import { DataverseVersion } from '../models/DataverseVersion'

export interface IDataverseInfoRepository {
  getDataverseVersion(): Promise<DataverseVersion>
  getZipDownloadLimit(): Promise<number>
  getMaxEmbargoDurationInMonths(): Promise<number>
  getApplicationTermsOfUse(lang?: string): Promise<string>
  getAvailableDatasetMetadataExportFormats(): Promise<DatasetMetadataExportFormats>
}
