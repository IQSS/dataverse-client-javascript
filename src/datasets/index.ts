import { DatasetsRepository } from './infra/repositories/DatasetsRepository';
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames';
import { GetDataset } from './domain/useCases/GetDataset';
import { GetPrivateUrlDataset } from './domain/useCases/GetPrivateUrlDataset';
import { GetDatasetCitation } from './domain/useCases/GetDatasetCitation';
import { GetPrivateUrlDatasetCitation } from './domain/useCases/GetPrivateUrlDatasetCitation';

const datasetsRepository = new DatasetsRepository();

const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository);
const getDataset = new GetDataset(datasetsRepository);
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository);
const getDatasetCitation = new GetDatasetCitation(datasetsRepository);
const getPrivateUrlDatasetCitation = new GetPrivateUrlDatasetCitation(datasetsRepository);

export {
  getDatasetSummaryFieldNames,
  getDataset,
  getPrivateUrlDataset,
  getDatasetCitation,
  getPrivateUrlDatasetCitation,
};
export { DatasetNotNumberedVersion } from './domain/models/DatasetNotNumberedVersion';
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
