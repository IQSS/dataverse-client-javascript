import { DataverseInfoRepository } from './infra/repositories/DataverseInfoRepository';
import { GetDataverseVersion } from './domain/useCases/GetDataverseVersion';
import { GetZipDownloadLimit } from './domain/useCases/GetZipDownloadLimit';
import { IsEmbargoEnabled } from './domain/useCases/IsEmbargoEnabled';

const dataverseInfoRepository = new DataverseInfoRepository();

const getDataverseVersion = new GetDataverseVersion(dataverseInfoRepository);
const getZipDownloadLimit = new GetZipDownloadLimit(dataverseInfoRepository);
const isEmbargoEnabled = new IsEmbargoEnabled(dataverseInfoRepository);

export { getDataverseVersion, getZipDownloadLimit, isEmbargoEnabled };
