import { DataverseInfoRepository } from './infra/repositories/DataverseInfoRepository'
import { GetDataverseVersion } from './domain/useCases/GetDataverseVersion'
import { GetZipDownloadLimit } from './domain/useCases/GetZipDownloadLimit'
import { GetMaxEmbargoDurationInMonths } from './domain/useCases/GetMaxEmbargoDurationInMonths'

const dataverseInfoRepository = new DataverseInfoRepository()

const getDataverseVersion = new GetDataverseVersion(dataverseInfoRepository)
const getZipDownloadLimit = new GetZipDownloadLimit(dataverseInfoRepository)
const getMaxEmbargoDurationInMonths = new GetMaxEmbargoDurationInMonths(dataverseInfoRepository)

export { getDataverseVersion, getZipDownloadLimit, getMaxEmbargoDurationInMonths }
