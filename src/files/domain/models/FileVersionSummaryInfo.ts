import { DatasetVersionState } from '../../../datasets/domain/models/Dataset'

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

export interface FileVersionSummarySubset {
  summaries: FileVersionSummaryInfo[]
  totalCount: number
}

export type FileDifferenceSummary = {
  file?: FileChangeType
  fileAccess?: 'Restricted' | 'Unrestricted'
  fileMetadata?: FileMetadataChange[]
  deaccessionedReason?: string
  fileTags?: { [key in FileChangeType]?: number }
}

export type FileChangeType = 'Added' | 'Deleted' | 'Replaced' | 'Changed'

export interface FileMetadataChange {
  name: string
  action: FileChangeType
}
