export interface DatasetVersionDiffPayload {
  oldVersion: VersionSummaryPayload
  newVersion: VersionSummaryPayload
  metadataChanges: MetadataBlockDiffPayload[]
  filesAdded: FileSummaryPayload[]
  filesRemoved: FileSummaryPayload[]
  fileChanges: FileDiffPayload[]
  filesReplaced: FileReplacementPayload[]
  TermsOfAccess: { changed: FieldDiffPayload[] }
}

export interface FileSummaryPayload {
  fileName: string
  MD5: string
  type: string
  fileId: number
  filePath: string
  description: string
  isRestricted: boolean
  tags: string[]
  categories: string[]
}

export interface VersionSummaryPayload {
  versionNumber: string
  lastUpdatedDate: string
}
export interface MetadataBlockDiffPayload {
  blockName: string
  changed: FieldDiffPayload[]
}

export interface FileDiffPayload {
  fileName: string
  md5: string
  fileId: number
  changed: FieldDiffPayload[]
}
export interface FieldDiffPayload {
  fieldName: string
  oldValue: string
  newValue: string
}

export interface FileReplacementPayload {
  oldFile: FileSummaryPayload
  newFile: FileSummaryPayload
}
