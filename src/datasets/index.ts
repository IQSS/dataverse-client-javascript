import { DatasetsRepository } from './infra/repositories/DatasetsRepository'
import { GetDatasetSummaryFieldNames } from './domain/useCases/GetDatasetSummaryFieldNames'
import { GetDataset } from './domain/useCases/GetDataset'
import { GetPrivateUrlDataset } from './domain/useCases/GetPrivateUrlDataset'
import { GetDatasetCitation } from './domain/useCases/GetDatasetCitation'
import { GetPrivateUrlDatasetCitation } from './domain/useCases/GetPrivateUrlDatasetCitation'
import { GetDatasetUserPermissions } from './domain/useCases/GetDatasetUserPermissions'
import { GetDatasetLocks } from './domain/useCases/GetDatasetLocks'
import { GetAllDatasetPreviews } from './domain/useCases/GetAllDatasetPreviews'
import { NewDatasetResourceValidator } from './domain/useCases/validators/NewDatasetResourceValidator'
import { MetadataBlocksRepository } from '../metadataBlocks/infra/repositories/MetadataBlocksRepository'
import { CreateDataset } from './domain/useCases/CreateDataset'
import { MetadataFieldValidator } from './domain/useCases/validators/MetadataFieldValidator'
import { SingleMetadataFieldValidator } from './domain/useCases/validators/SingleMetadataFieldValidator'
import { MultipleMetadataFieldValidator } from './domain/useCases/validators/MultipleMetadataFieldValidator'
import { PublishDataset } from './domain/useCases/PublishDataset'

const datasetsRepository = new DatasetsRepository()

const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository)
const getDataset = new GetDataset(datasetsRepository)
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository)
const getDatasetCitation = new GetDatasetCitation(datasetsRepository)
const getPrivateUrlDatasetCitation = new GetPrivateUrlDatasetCitation(datasetsRepository)
const getDatasetUserPermissions = new GetDatasetUserPermissions(datasetsRepository)
const getDatasetLocks = new GetDatasetLocks(datasetsRepository)
const getAllDatasetPreviews = new GetAllDatasetPreviews(datasetsRepository)
const singleMetadataFieldValidator = new SingleMetadataFieldValidator()
const metadataFieldValidator = new MetadataFieldValidator(
  new SingleMetadataFieldValidator(),
  new MultipleMetadataFieldValidator(singleMetadataFieldValidator)
)
const createDataset = new CreateDataset(
  datasetsRepository,
  new MetadataBlocksRepository(),
  new NewDatasetResourceValidator(metadataFieldValidator)
)
const publishDataset = new PublishDataset(datasetsRepository)

export {
  getDatasetSummaryFieldNames,
  getDataset,
  getPrivateUrlDataset,
  getDatasetCitation,
  getPrivateUrlDatasetCitation,
  getDatasetUserPermissions,
  getDatasetLocks,
  getAllDatasetPreviews,
  createDataset,
  publishDataset
}
export { DatasetNotNumberedVersion } from './domain/models/DatasetNotNumberedVersion'
export { DatasetUserPermissions } from './domain/models/DatasetUserPermissions'
export { DatasetLock, DatasetLockType } from './domain/models/DatasetLock'
export {
  Dataset,
  DatasetVersionInfo,
  DatasetVersionState,
  DatasetLicense,
  DatasetMetadataBlocks,
  DatasetMetadataBlock,
  DatasetMetadataFields,
  DatasetMetadataFieldValue,
  DatasetMetadataSubField
} from './domain/models/Dataset'
export { DatasetPreview } from './domain/models/DatasetPreview'
export { DatasetPreviewSubset } from './domain/models/DatasetPreviewSubset'
export {
  NewDatasetDTO as NewDataset,
  NewDatasetMetadataBlockValuesDTO as NewDatasetMetadataBlockValues,
  NewDatasetMetadataFieldsDTO as NewDatasetMetadataFields,
  NewDatasetMetadataFieldValueDTO as NewDatasetMetadataFieldValue,
  NewDatasetMetadataChildFieldValueDTO as NewDatasetMetadataChildFieldValue
} from './domain/dtos/NewDatasetDTO'
export { CreatedDatasetIdentifiers } from './domain/models/CreatedDatasetIdentifiers'
export { VersionUpdateType } from './domain/models/Dataset'
