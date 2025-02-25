export interface DatasetVersionSummary {
  id: number
  versionNumber: string
  summary?: Summary | SummaryStringValues
  contributors: string
  publishedOn?: string
}

export type Summary = {
  [key: string]: SummaryUpdates | SummaryUpdatesWithFields | FilesSummaryUpdates | boolean
}

export interface SummaryUpdates {
  added: string // deberia ser number chequear
  deleted: string
  changed: string
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

// SummaryUpdates Example:
/*
    summary: {
        "Geospatial Metadata": {
            added: 1,
            deleted: 0,
            changed: 0
        },
    }
*/

// SummaryUpdatesWithFields Example:
/*
    summary: {
        'Citation Metadata': {
            Description: {
                added: 0,
                deleted: 0,
                changed: 1
            },
            Title: {
                added: 0,
                deleted: 0,
                changed: 1
            }
        }
    }
*/

// FilesSummaryUpdates Example:
/*
    summary: {
        files: {
            added: 1,
            removed: 0,
            replaced: 0,
            changedFileMetaData: 2,
            changedVariableMetadata: 0
        },
    }
*/

const version: DatasetVersionSummary = {
  id: 1,
  versionNumber: '1.0',
  contributors: 'John Doe',
  publishedOn: '2021-06-01',
  summary: {
    files: {
      added: 1,
      changedFileMetaData: 2,
      removed: 0,
      replaced: 0,
      changedVariableMetadata: 0
    },
    'Citation Metadata': {
      Title: {
        added: '0',
        deleted: '0',
        changed: '1'
      }
    },
    termsAccessChanged: true
  }
}

console.log({
  typeof: typeof (
    (version.summary as Summary)?.['Citation Metadata'] as SummaryUpdatesWithFields
  )?.['Title'].changed
})

// console.log({ typeof: typeof (version.summary as SummaryChanges)?.['Title'].changed })
