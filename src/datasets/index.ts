import { DatasetsRepository } from './infra/repositories/DatasetsRepository';
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames';
import { GetDatasetById } from './domain/useCases/GetDatasetById';
import { GetDatasetByPersistentId } from './domain/useCases/GetDatasetByPersistentId';
import { GetPrivateUrlDataset } from './domain/useCases/GetPrivateUrlDataset';
import { GetDatasetCitation } from './domain/useCases/GetDatasetCitation';

const datasetsRepository = new DatasetsRepository();

const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository);
const getDatasetById = new GetDatasetById(datasetsRepository);
const getDatasetByPersistentId = new GetDatasetByPersistentId(datasetsRepository);
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository);
const getDatasetCitation = new GetDatasetCitation(datasetsRepository);

export {
  getDatasetSummaryFieldNames,
  getDatasetById,
  getDatasetByPersistentId,
  getPrivateUrlDataset,
  getDatasetCitation,
};
export {
  Dataset,
  DatasetVersionInfo,
  DatasetVersionState,
  DatasetLicense,
  DatasetMetadataBlock,
  DatasetMetadataFields,
  DatasetMetadataFieldValue,
  DatasetMetadataSubField,
} from './domain/models/Dataset';
