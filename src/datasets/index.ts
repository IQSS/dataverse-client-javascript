import { DatasetsRepository } from './infra/repositories/DatasetsRepository';
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames';
import { GetDataset } from './domain/useCases/GetDataset';
import { GetPrivateUrlDataset } from './domain/useCases/GetPrivateUrlDataset';

const datasetsRepository = new DatasetsRepository();

const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository);
const getDataset = new GetDataset(datasetsRepository);
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository);

export { getDatasetSummaryFieldNames, getDataset, getPrivateUrlDataset };
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
