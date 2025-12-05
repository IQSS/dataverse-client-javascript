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
import { DirectUploadClient, DirectUploadClientConfig } from './infra/clients/DirectUploadClient'
import { AddUploadedFilesToDataset } from './domain/useCases/AddUploadedFilesToDataset'
import { DeleteFile } from './domain/useCases/DeleteFile'
import { ReplaceFile } from './domain/useCases/ReplaceFile'
import { RestrictFile } from './domain/useCases/RestrictFile'
import { UpdateFileMetadata } from './domain/useCases/UpdateFileMetadata'
import { UpdateFileTabularTags } from './domain/useCases/UpdateFileTabularTags'
import { UpdateFileCategories } from './domain/useCases/UpdateFileCategories'
import { GetFileVersionSummaries } from './domain/useCases/GetFileVersionSummaries'
import { IsFileDeleted } from './domain/useCases/IsFileDeleted'

/**
 * Configuration for file upload operations.
 * Use FilesConfig.init() to configure upload behavior before using uploadFile.
 */
class FilesConfig {
  private static uploadConfig: DirectUploadClientConfig = {}

  /**
   * Initialize file upload configuration.
   * @param config - Configuration options for file uploads
   * @param config.useS3Tagging - Whether to include S3 tagging header (x-amz-tagging: dv-state=temp).
   *                              Set to false if your S3 implementation doesn't support object tagging. Default: true
   * @param config.maxMultipartRetries - Maximum number of retries for multipart upload parts. Default: 5
   * @param config.fileUploadTimeoutMs - Timeout in milliseconds for file upload operations. Default: 60000
   */
  static init(config: DirectUploadClientConfig) {
    this.uploadConfig = config
  }

  static getConfig(): DirectUploadClientConfig {
    return this.uploadConfig
  }
}

const filesRepository = new FilesRepository()
// DirectUploadClient is created lazily to allow configuration before first use
let directUploadClientInstance: DirectUploadClient | null = null

const getDirectUploadClient = (): DirectUploadClient => {
  if (!directUploadClientInstance) {
    directUploadClientInstance = new DirectUploadClient(filesRepository, FilesConfig.getConfig())
  }
  return directUploadClientInstance
}

const getDatasetFiles = new GetDatasetFiles(filesRepository)
const getDatasetFileCounts = new GetDatasetFileCounts(filesRepository)
const getFileDownloadCount = new GetFileDownloadCount(filesRepository)
const getFileUserPermissions = new GetFileUserPermissions(filesRepository)
const getFileDataTables = new GetFileDataTables(filesRepository)
const getDatasetFilesTotalDownloadSize = new GetDatasetFilesTotalDownloadSize(filesRepository)
const getFile = new GetFile(filesRepository)
const getFileAndDataset = new GetFileAndDataset(filesRepository)
const getFileCitation = new GetFileCitation(filesRepository)
const addUploadedFilesToDataset = new AddUploadedFilesToDataset(filesRepository)
const deleteFile = new DeleteFile(filesRepository)
const replaceFile = new ReplaceFile(filesRepository)
const restrictFile = new RestrictFile(filesRepository)
const updateFileMetadata = new UpdateFileMetadata(filesRepository)
const updateFileTabularTags = new UpdateFileTabularTags(filesRepository)
const updateFileCategories = new UpdateFileCategories(filesRepository)
const getFileVersionSummaries = new GetFileVersionSummaries(filesRepository)
const isFileDeleted = new IsFileDeleted(filesRepository)

// uploadFile is created lazily to respect FilesConfig settings
let uploadFileInstance: UploadFile | null = null

/**
 * Uploads a file to remote storage and returns the storage identifier.
 * Respects FilesConfig settings (call FilesConfig.init() before first upload if you need custom config).
 */
const uploadFile = {
  execute: (
    datasetId: number | string,
    file: File,
    progress: (now: number) => void,
    abortController: AbortController
  ): Promise<string> => {
    if (!uploadFileInstance) {
      uploadFileInstance = new UploadFile(getDirectUploadClient())
    }
    return uploadFileInstance.execute(datasetId, file, progress, abortController)
  }
}

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
  uploadFile,
  addUploadedFilesToDataset,
  deleteFile,
  restrictFile,
  updateFileMetadata,
  updateFileTabularTags,
  updateFileCategories,
  replaceFile,
  getFileVersionSummaries,
  isFileDeleted,
  FilesConfig
}

export { FileModel as File, FileEmbargo, FileChecksum } from './domain/models/FileModel'
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
export { FilePreview, FilePreviewChecksum } from './domain/models/FilePreview'
export { UploadedFileDTO } from './domain/dtos/UploadedFileDTO'
export { UpdateFileMetadataDTO } from './domain/dtos/UpdateFileMetadataDTO'
export {
  FileVersionSummaryInfo,
  FileDifferenceSummary,
  FileChangeType,
  FileMetadataChange,
  FileVersionSummarySubset
} from './domain/models/FileVersionSummaryInfo'
