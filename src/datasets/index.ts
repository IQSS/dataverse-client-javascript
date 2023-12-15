import { DatasetsRepository } from './infra/repositories/DatasetsRepository';
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames';
import { GetDataset } from './domain/useCases/GetDataset';
import { GetPrivateUrlDataset } from './domain/useCases/GetPrivateUrlDataset';
import { GetDatasetCitation } from './domain/useCases/GetDatasetCitation';
import { GetPrivateUrlDatasetCitation } from './domain/useCases/GetPrivateUrlDatasetCitation';
import { GetDatasetUserPermissions } from './domain/useCases/GetDatasetUserPermissions';
import { GetDatasetLocks } from './domain/useCases/GetDatasetLocks';
import { GetCollectionDatasetPreviews } from './domain/useCases/GetCollectionDatasetPreviews';

const datasetsRepository = new DatasetsRepository();

const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository);
const getDataset = new GetDataset(datasetsRepository);
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository);
const getDatasetCitation = new GetDatasetCitation(datasetsRepository);
const getPrivateUrlDatasetCitation = new GetPrivateUrlDatasetCitation(datasetsRepository);
const getDatasetUserPermissions = new GetDatasetUserPermissions(datasetsRepository);
const getDatasetLocks = new GetDatasetLocks(datasetsRepository);
const getCollectionDatasetPreviews = new GetCollectionDatasetPreviews(datasetsRepository);

export {
  getDatasetSummaryFieldNames,
  getDataset,
  getPrivateUrlDataset,
  getDatasetCitation,
  getPrivateUrlDatasetCitation,
  getDatasetUserPermissions,
  getDatasetLocks,
  getCollectionDatasetPreviews,
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
export { DatasetPreview } from './domain/models/DatasetPreview';
