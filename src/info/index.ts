import { DataverseInfoRepository } from './infra/repositories/DataverseInfoRepository';
import { GetDataverseVersion } from './domain/useCases/GetDataverseVersion';

const getDataverseVersion = new GetDataverseVersion(new DataverseInfoRepository());

export { getDataverseVersion };
