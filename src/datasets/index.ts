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
import { GetDatasetVersionDiff } from './domain/useCases/GetDatasetVersionDiff'
import { DeaccessionDataset } from './domain/useCases/DeaccessionDataset'
import { GetDatasetDownloadCount } from './domain/useCases/GetDatasetDownloadCount'
import { GetDatasetVersionsSummaries } from './domain/useCases/GetDatasetVersionsSummaries'
import { DeleteDatasetDraft } from './domain/useCases/DeleteDatasetDraft'
import { LinkDataset } from './domain/useCases/LinkDataset'
import { UnlinkDataset } from './domain/useCases/UnlinkDataset'
import { GetDatasetLinkedCollections } from './domain/useCases/GetDatasetLinkedCollections'
import { GetDatasetAvailableCategories } from './domain/useCases/GetDatasetAvailableCategories'
import { GetDatasetAvailableDatasetTypes } from './domain/useCases/GetDatasetAvailableDatasetTypes'
import { GetDatasetAvailableDatasetType } from './domain/useCases/GetDatasetAvailableDatasetType'
import { AddDatasetType } from './domain/useCases/AddDatasetType'
import { LinkDatasetTypeWithMetadataBlocks } from './domain/useCases/LinkDatasetTypeWithMetadataBlocks'
import { SetAvailableLicensesForDatasetType } from './domain/useCases/SetAvailableLicensesForDatasetType'
import { DeleteDatasetType } from './domain/useCases/DeleteDatasetType'
import { GetDatasetCitationInOtherFormats } from './domain/useCases/GetDatasetCitationInOtherFormats'
import { GetDatasetTemplates } from './domain/useCases/GetDatasetTemplates'
import { UpdateTermsOfAccess } from './domain/useCases/UpdateTermsOfAccess'

const datasetsRepository = new DatasetsRepository()

const getDataset = new GetDataset(datasetsRepository)
const getDatasetLocks = new GetDatasetLocks(datasetsRepository)
const getDatasetCitation = new GetDatasetCitation(datasetsRepository)
const getPrivateUrlDataset = new GetPrivateUrlDataset(datasetsRepository)
const getAllDatasetPreviews = new GetAllDatasetPreviews(datasetsRepository)
const getDatasetUserPermissions = new GetDatasetUserPermissions(datasetsRepository)
const getDatasetSummaryFieldNames = new GetDatasetSummaryFieldNames(datasetsRepository)
const getPrivateUrlDatasetCitation = new GetPrivateUrlDatasetCitation(datasetsRepository)
const getDatasetVersionDiff = new GetDatasetVersionDiff(datasetsRepository)
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
const deaccessionDataset = new DeaccessionDataset(datasetsRepository)
const getDatasetDownloadCount = new GetDatasetDownloadCount(datasetsRepository)
const getDatasetVersionsSummaries = new GetDatasetVersionsSummaries(datasetsRepository)
const deleteDatasetDraft = new DeleteDatasetDraft(datasetsRepository)
const linkDataset = new LinkDataset(datasetsRepository)
const unlinkDataset = new UnlinkDataset(datasetsRepository)
const getDatasetLinkedCollections = new GetDatasetLinkedCollections(datasetsRepository)
const getDatasetAvailableCategories = new GetDatasetAvailableCategories(datasetsRepository)
const getDatasetAvailableDatasetTypes = new GetDatasetAvailableDatasetTypes(datasetsRepository)
const getDatasetAvailableDatasetType = new GetDatasetAvailableDatasetType(datasetsRepository)
const addDatasetType = new AddDatasetType(datasetsRepository)
const linkDatasetTypeWithMetadataBlocks = new LinkDatasetTypeWithMetadataBlocks(datasetsRepository)
const setAvailableLicensesForDatasetType = new SetAvailableLicensesForDatasetType(
  datasetsRepository
)
const deleteDatasetType = new DeleteDatasetType(datasetsRepository)
const getDatasetCitationInOtherFormats = new GetDatasetCitationInOtherFormats(datasetsRepository)
const getDatasetTemplates = new GetDatasetTemplates(datasetsRepository)
const updateTermsOfAccess = new UpdateTermsOfAccess(datasetsRepository)

export {
  getDataset,
  getDatasetLocks,
  getDatasetCitation,
  getPrivateUrlDataset,
  getAllDatasetPreviews,
  getDatasetUserPermissions,
  getDatasetSummaryFieldNames,
  getPrivateUrlDatasetCitation,
  getDatasetVersionDiff,
  publishDataset,
  createDataset,
  updateDataset,
  deaccessionDataset,
  getDatasetDownloadCount,
  getDatasetVersionsSummaries,
  deleteDatasetDraft,
  linkDataset,
  unlinkDataset,
  getDatasetLinkedCollections,
  getDatasetAvailableCategories,
  getDatasetCitationInOtherFormats,
  getDatasetTemplates,
  updateTermsOfAccess,
  getDatasetAvailableDatasetTypes,
  getDatasetAvailableDatasetType,
  addDatasetType,
  linkDatasetTypeWithMetadataBlocks,
  setAvailableLicensesForDatasetType,
  deleteDatasetType
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
  DatasetMetadataFieldValue,
  TermsOfUse
} from './domain/models/Dataset'
export { DatasetPreview } from './domain/models/DatasetPreview'
export { DatasetVersionDiff } from './domain/models/DatasetVersionDiff'
export { DatasetPreviewSubset } from './domain/models/DatasetPreviewSubset'
export {
  DatasetDTO,
  DatasetMetadataFieldsDTO,
  DatasetMetadataFieldValueDTO,
  DatasetMetadataBlockValuesDTO,
  DatasetMetadataChildFieldValueDTO
} from './domain/dtos/DatasetDTO'
export { DatasetDeaccessionDTO } from './domain/dtos/DatasetDeaccessionDTO'
export { CreatedDatasetIdentifiers } from './domain/models/CreatedDatasetIdentifiers'
export { VersionUpdateType } from './domain/models/Dataset'
export {
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues,
  DatasetVersionSummarySubset
} from './domain/models/DatasetVersionSummaryInfo'
export { DatasetLinkedCollection } from './domain/models/DatasetLinkedCollection'
export { DatasetType } from './domain/models/DatasetType'
export { DatasetTypeDTO } from './domain/dtos/DatasetTypeDTO'
