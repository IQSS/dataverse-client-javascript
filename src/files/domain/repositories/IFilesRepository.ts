import { FilesSubset } from '../models/FilesSubset'
import { FileDataTable } from '../models/FileDataTable'
import { FileUserPermissions } from '../models/FileUserPermissions'
import { FileSearchCriteria, FileOrderCriteria } from '../models/FileCriteria'
import { FileCounts } from '../models/FileCounts'
import { FileDownloadSizeMode } from '../models/FileDownloadSizeMode'
import { FileModel } from '../models/FileModel'
import { Dataset } from '../../../datasets'
import { FileUploadDestination } from '../models/FileUploadDestination'
import { UploadedFileDTO } from '../dtos/UploadedFileDTO'

export interface IFilesRepository {
  getDatasetFiles(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    fileOrderCriteria: FileOrderCriteria,
    limit?: number,
    offset?: number,
    fileSearchCriteria?: FileSearchCriteria
  ): Promise<FilesSubset>

  getDatasetFileCounts(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    fileSearchCriteria?: FileSearchCriteria
  ): Promise<FileCounts>

  getDatasetFilesTotalDownloadSize(
    datasetId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean,
    fileDownloadSizeMode: FileDownloadSizeMode,
    fileSearchCriteria?: FileSearchCriteria
  ): Promise<number>

  getFileDownloadCount(fileId: number | string): Promise<number>

  getFileUserPermissions(fileId: number | string): Promise<FileUserPermissions>

  getFileDataTables(fileId: number | string): Promise<FileDataTable[]>

  getFile(
    fileId: number | string,
    datasetVersionId: string,
    returnDatasetVersion: boolean
  ): Promise<FileModel | [FileModel, Dataset]>

  getFileCitation(
    fileId: number | string,
    datasetVersionId: string,
    includeDeaccessioned: boolean
  ): Promise<string>

  getFileUploadDestination(datasetId: number | string, file: File): Promise<FileUploadDestination>

  addUploadedFileToDataset(
    datasetId: number | string,
    uploadedFileDTO: UploadedFileDTO
  ): Promise<undefined>
}
