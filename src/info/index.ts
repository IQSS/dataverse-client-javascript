import { DataverseInfoRepository } from './infra/repositories/DataverseInfoRepository'
import { GetDataverseVersion } from './domain/useCases/GetDataverseVersion'
import { GetZipDownloadLimit } from './domain/useCases/GetZipDownloadLimit'
import { GetMaxEmbargoDurationInMonths } from './domain/useCases/GetMaxEmbargoDurationInMonths'
import { GetApplicationTermsOfUse } from './domain/useCases/GetApplicationTermsOfUse'
import { GetAvailableDatasetMetadataExportFormats } from './domain/useCases/GetAvailableDatasetMetadataExportFormats'

const dataverseInfoRepository = new DataverseInfoRepository()

const getDataverseVersion = new GetDataverseVersion(dataverseInfoRepository)
const getZipDownloadLimit = new GetZipDownloadLimit(dataverseInfoRepository)
const getMaxEmbargoDurationInMonths = new GetMaxEmbargoDurationInMonths(dataverseInfoRepository)
const getApplicationTermsOfUse = new GetApplicationTermsOfUse(dataverseInfoRepository)
const getAvailableDatasetMetadataExportFormats = new GetAvailableDatasetMetadataExportFormats(
  dataverseInfoRepository
)

export {
  getDataverseVersion,
  getZipDownloadLimit,
  getMaxEmbargoDurationInMonths,
  getApplicationTermsOfUse,
  getAvailableDatasetMetadataExportFormats
}

export { DatasetMetadataExportFormats } from './domain/models/DatasetMetadataExportFormats'
