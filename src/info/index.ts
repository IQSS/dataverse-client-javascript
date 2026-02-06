import { DataverseInfoRepository } from './infra/repositories/DataverseInfoRepository'
import { GetDataverseVersion } from './domain/useCases/GetDataverseVersion'
import { GetZipDownloadLimit } from './domain/useCases/GetZipDownloadLimit'
import { GetMaxEmbargoDurationInMonths } from './domain/useCases/GetMaxEmbargoDurationInMonths'
import { GetApplicationTermsOfUse } from './domain/useCases/GetApplicationTermsOfUse'
import { GetAvailableDatasetMetadataExportFormats } from './domain/useCases/GetAvailableDatasetMetadataExportFormats'
import { GetDatasetPublishPopupCustomText } from './domain/useCases/GetDatasetPublishPopupCustomText'
import { GetPublishDatasetDisclaimerText } from './domain/useCases/GetPublishDatasetDisclaimerText'

const dataverseInfoRepository = new DataverseInfoRepository()

const getDataverseVersion = new GetDataverseVersion(dataverseInfoRepository)
const getZipDownloadLimit = new GetZipDownloadLimit(dataverseInfoRepository)
const getMaxEmbargoDurationInMonths = new GetMaxEmbargoDurationInMonths(dataverseInfoRepository)
const getApplicationTermsOfUse = new GetApplicationTermsOfUse(dataverseInfoRepository)
const getAvailableDatasetMetadataExportFormats = new GetAvailableDatasetMetadataExportFormats(
  dataverseInfoRepository
)
const getPublishDatasetDisclaimerText = new GetPublishDatasetDisclaimerText(dataverseInfoRepository)
const getDatasetPublishPopupCustomText = new GetDatasetPublishPopupCustomText(
  dataverseInfoRepository
)

export {
  getDataverseVersion,
  getZipDownloadLimit,
  getMaxEmbargoDurationInMonths,
  getApplicationTermsOfUse,
  getAvailableDatasetMetadataExportFormats,
  getDatasetPublishPopupCustomText,
  getPublishDatasetDisclaimerText
}

export { DatasetMetadataExportFormats } from './domain/models/DatasetMetadataExportFormats'
