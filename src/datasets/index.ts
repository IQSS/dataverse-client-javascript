import { DatasetsRepository } from './infra/repositories/DatasetsRepository';
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames';
import { GetDataset } from './domain/useCases/GetDataset';
import { GetPrivateUrlDataset } from './domain/useCases/GetPrivateUrlDataset';
import { GetDatasetCitation } from './domain/useCases/GetDatasetCitation';
import { GetPrivateUrlDatasetCitation } from './domain/useCases/GetPrivateUrlDatasetCitation';
import { GetDatasetUserPermissions } from './domain/useCases/GetDatasetUserPermissions';
import { GetDatasetLocks } from './domain/useCases/GetDatasetLocks';

const datasetsRepository = new DatasetsRepository();

const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository);
const getDataset = new GetDataset(datasetsRepository);
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository);
const getDatasetCitation = new GetDatasetCitation(datasetsRepository);
const getPrivateUrlDatasetCitation = new GetPrivateUrlDatasetCitation(datasetsRepository);
const getDatasetUserPermissions = new GetDatasetUserPermissions(datasetsRepository);
const getDatasetLocks = new GetDatasetLocks(datasetsRepository);

export {
  getDatasetSummaryFieldNames,
  getDataset,
  getPrivateUrlDataset,
  getDatasetCitation,
  getPrivateUrlDatasetCitation,
  getDatasetUserPermissions,
  getDatasetLocks,
};
export { DatasetNotNumberedVersion } from './domain/models/DatasetNotNumberedVersion';
export { DatasetUserPermissions } from './domain/models/DatasetUserPermissions';
export { DatasetLock, DatasetLockType } from './domain/models/DatasetLock';
export {
  Dataset,
  DatasetVersionInfo,
  DatasetVersionState,
  DatasetLicense,
  DatasetMetadataBlocks,
  DatasetMetadataBlock,
  DatasetMetadataFields,
  DatasetMetadataFieldValue,
  DatasetMetadataSubField,
} from './domain/models/Dataset';
