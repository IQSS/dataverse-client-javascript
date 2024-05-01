import { DatasetsRepository } from './infra/repositories/DatasetsRepository'
import { MetadataBlocksRepository } from '../metadataBlocks/infra/repositories/MetadataBlocksRepository'
import { GetDataset } from './domain/useCases/GetDataset'
import { CreateDataset } from './domain/useCases/CreateDataset'
import { GetDatasetLocks } from './domain/useCases/GetDatasetLocks'
import { GetDatasetCitation } from './domain/useCases/GetDatasetCitation'
import { GetPrivateUrlDataset } from './domain/useCases/GetPrivateUrlDataset'
import { GetAllDatasetPreviews } from './domain/useCases/GetAllDatasetPreviews'
import { MetadataFieldValidator } from './domain/useCases/validators/MetadataFieldValidator'
import { GetDatasetUserPermissions } from './domain/useCases/GetDatasetUserPermissions'
import { DatasetResourceValidator } from './domain/useCases/validators/DatasetResourceValidator'
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames'
import { GetPrivateUrlDatasetCitation } from './domain/useCases/GetPrivateUrlDatasetCitation'
import { SingleMetadataFieldValidator } from './domain/useCases/validators/SingleMetadataFieldValidator'
import { MultipleMetadataFieldValidator } from './domain/useCases/validators/MultipleMetadataFieldValidator'
import { PublishDataset } from './domain/useCases/PublishDataset'
import { UpdateDataset } from './domain/useCases/UpdateDataset'

const datasetsRepository = new DatasetsRepository()

const getDataset = new GetDataset(datasetsRepository)
const getDatasetLocks = new GetDatasetLocks(datasetsRepository)
const getDatasetCitation = new GetDatasetCitation(datasetsRepository)
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository)
const getAllDatasetPreviews = new GetAllDatasetPreviews(datasetsRepository)
const getDatasetUserPermissions = new GetDatasetUserPermissions(datasetsRepository)
const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository)
const getPrivateUrlDatasetCitation = new GetPrivateUrlDatasetCitation(datasetsRepository)
const singleMetadataFieldValidator = new SingleMetadataFieldValidator()
const metadataFieldValidator = new MetadataFieldValidator(
  new SingleMetadataFieldValidator(),
  new MultipleMetadataFieldValidator(singleMetadataFieldValidator)
)
const publishDataset = new PublishDataset(datasetsRepository)
const metadataBlocksRepository = new MetadataBlocksRepository()
const datasetResourceValidator = new DatasetResourceValidator(metadataFieldValidator)
const createDataset = new CreateDataset(
  datasetsRepository,
  metadataBlocksRepository,
  datasetResourceValidator
)
const updateDataset = new UpdateDataset(
  datasetsRepository,
  metadataBlocksRepository,
  datasetResourceValidator
)

export {
  getDataset,
  getDatasetLocks,
  getDatasetCitation,
  getPrivateUrlDataset,
  getAllDatasetPreviews,
  getDatasetUserPermissions,
  getDatasetSummaryFieldNames,
  getPrivateUrlDatasetCitation,
  publishDataset,
  createDataset,
  updateDataset
}
export { DatasetNotNumberedVersion } from './domain/models/DatasetNotNumberedVersion'
export { DatasetUserPermissions } from './domain/models/DatasetUserPermissions'
export { DatasetLock, DatasetLockType } from './domain/models/DatasetLock'
export {
  Dataset,
  DatasetLicense,
  DatasetVersionInfo,
  DatasetVersionState,
  DatasetMetadataBlock,
  DatasetMetadataBlocks,
  DatasetMetadataFields,
  DatasetMetadataSubField,
  DatasetMetadataFieldValue
} from './domain/models/Dataset'
export { DatasetPreview } from './domain/models/DatasetPreview'
export { DatasetPreviewSubset } from './domain/models/DatasetPreviewSubset'
export {
  DatasetDTO,
  DatasetMetadataFieldsDTO,
  DatasetMetadataFieldValueDTO,
  DatasetMetadataBlockValuesDTO,
  DatasetMetadataChildFieldValueDTO
} from './domain/dtos/DatasetDTO'
export { CreatedDatasetIdentifiers } from './domain/models/CreatedDatasetIdentifiers'
export { VersionUpdateType } from './domain/models/Dataset'
