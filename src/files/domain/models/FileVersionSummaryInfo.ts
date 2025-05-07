export interface FileVersionSummaryInfo {
  datasetVersion: string
  versionNumber?: number
  versionMinorNumber?: number
  contributors?: string
  publishedDate: string
  fileDifferenceSummary?: FileDifferenceSummary
  isDraft: boolean
  isDeaccessioned: boolean
  isReleased: boolean
  versionState?: FileVersionState
  datafileId: number
  persistentId?: string
  versionNote?: string
}

export enum FileVersionState {
  RELEASED = 'RELEASED',
  DEACCESSIONED = 'DEACCESSIONED',
  DRAFT = 'DRAFT'
}

export type FileDifferenceSummary = {
  file?: FileChangeType
  FileAccess?: FileAccessChangeType
  FileMetadata?: FileMetadataChange[]
  deaccessionedReason?: string
  FileTags?: FileTagChange
}

export type FileChangeType = 'Added' | 'Deleted' | 'Replaced' | 'Changed'
export type FileAccessChangeType = 'Restricted' | 'Public'

export type FileTagChange = {
  Added?: number
  Deleted?: number
  Changed?: number
}

export interface FileMetadataChange {
  name: string
  action: FileChangeType
}
