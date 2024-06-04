import { FilesRepository } from './infra/repositories/FilesRepository'
import { GetDatasetFiles } from './domain/useCases/GetDatasetFiles'
import { GetDatasetFileCounts } from './domain/useCases/GetDatasetFileCounts'
import { GetFileDownloadCount } from './domain/useCases/GetFileDownloadCount'
import { GetFileUserPermissions } from './domain/useCases/GetFileUserPermissions'
import { GetFileDataTables } from './domain/useCases/GetFileDataTables'
import { GetDatasetFilesTotalDownloadSize } from './domain/useCases/GetDatasetFilesTotalDownloadSize'
import { GetFile } from './domain/useCases/GetFile'
import { GetFileCitation } from './domain/useCases/GetFileCitation'
import { GetFileAndDataset } from './domain/useCases/GetFileAndDataset'
import { UploadFile } from './domain/useCases/UploadFile'
import { DirectUploadClient } from './infra/clients/DirectUploadClient'

const filesRepository = new FilesRepository()
const directUploadClient = new DirectUploadClient(filesRepository)

const getDatasetFiles = new GetDatasetFiles(filesRepository)
const getDatasetFileCounts = new GetDatasetFileCounts(filesRepository)
const getFileDownloadCount = new GetFileDownloadCount(filesRepository)
const getFileUserPermissions = new GetFileUserPermissions(filesRepository)
const getFileDataTables = new GetFileDataTables(filesRepository)
const getDatasetFilesTotalDownloadSize = new GetDatasetFilesTotalDownloadSize(filesRepository)
const getFile = new GetFile(filesRepository)
const getFileAndDataset = new GetFileAndDataset(filesRepository)
const getFileCitation = new GetFileCitation(filesRepository)
const uploadFile = new UploadFile(directUploadClient)

export {
  getDatasetFiles,
  getFileDownloadCount,
  getFileUserPermissions,
  getFileDataTables,
  getDatasetFileCounts,
  getDatasetFilesTotalDownloadSize,
  getFile,
  getFileAndDataset,
  getFileCitation,
  uploadFile
}

export { File, FileEmbargo, FileChecksum } from './domain/models/File'
export { FileUserPermissions } from './domain/models/FileUserPermissions'
export {
  FileSearchCriteria,
  FileOrderCriteria,
  FileAccessStatus
} from './domain/models/FileCriteria'
export {
  FileCounts,
  FileContentTypeCount,
  FileAccessStatusCount,
  FileCategoryNameCount
} from './domain/models/FileCounts'
export {
  FileDataTable,
  FileDataVariable,
  FileDataVariableMetadata,
  FileDataVariableInvalidRanges,
  FileDataVariableCategoryMetadata,
  FileDataVariableCategory,
  FileDataVariableIntervalType,
  FileDataVariableFormatType
} from './domain/models/FileDataTable'
export { FileDownloadSizeMode } from './domain/models/FileDownloadSizeMode'
export { FilesSubset } from './domain/models/FilesSubset'
