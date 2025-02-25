export interface DatasetVersionInfo {
  id: number
  versionNumber: string
  summary?: DatasetVersionSummary | SummaryStringValues
  contributors: string
  publishedOn?: string
}

export type DatasetVersionSummary = {
  [key: string]: SummaryUpdates | SummaryUpdatesWithFields | FilesSummaryUpdates | boolean
}

export interface SummaryUpdates {
  added: number
  deleted: number
  changed: number
}

export interface SummaryUpdatesWithFields {
  [key: string]: SummaryUpdates
}

export interface FilesSummaryUpdates {
  added: number
  removed: number
  replaced: number
  changedFileMetaData: number
  changedVariableMetadata: number
}

export enum SummaryStringValues {
  firstPublished = 'firstPublished',
  firstDraft = 'firstDraft',
  versionDeaccessioned = 'versionDeaccessioned',
  previousVersionDeaccessioned = 'previousVersionDeaccessioned'
}

export enum SummaryKnownFields {
  files = 'files',
  termsAccessChanged = 'termsAccessChanged'
}
