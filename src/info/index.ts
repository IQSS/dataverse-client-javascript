import { DataverseInfoRepository } from './infra/repositories/DataverseInfoRepository';
import { GetDataverseVersion } from './domain/useCases/GetDataverseVersion';
import { GetZipDownloadLimit } from './domain/useCases/GetZipDownloadLimit';

const dataverseInfoRepository = new DataverseInfoRepository();

const getDataverseVersion = new GetDataverseVersion(dataverseInfoRepository);
const getZipDownloadLimit = new GetZipDownloadLimit(dataverseInfoRepository);

export { getDataverseVersion, getZipDownloadLimit };
