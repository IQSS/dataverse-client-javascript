import { DatasetVersionState } from '../../../datasets/domain/models/Dataset'
import { FileAccessStatus } from '../../../files/domain/models/FileCriteria'

export interface FileVersionSummaryInfo {
  datasetVersion: string
  contributors?: string
  publishedDate?: string
  fileDifferenceSummary?: FileDifferenceSummary
  versionState?: DatasetVersionState
  datafileId: number
  persistentId?: string
  versionNote?: string
}

export type FileDifferenceSummary = {
  file?: FileChangeType
  fileAccess?: FileAccessStatus
  fileMetadata?: FileMetadataChange[]
  deaccessionedReason?: string
  fileTags?: { [key in FileChangeType]?: number }
}

export type FileChangeType = 'Added' | 'Deleted' | 'Replaced' | 'Changed'

export interface FileMetadataChange {
  name: string
  action: FileChangeType
}
