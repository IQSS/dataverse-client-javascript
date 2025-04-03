import { DatasetVersionState } from '../../../src'
import {
  DatasetVersionDiff,
  VersionSummary,
  MetadataBlockDiff,
  FileSummary,
  FileDiff,
  FileReplacement,
  FieldDiff
} from '../../../src/datasets/domain/models/DatasetVersionDiff'

export const createDatasetVersionDiff = (): DatasetVersionDiff => {
  const versionSummary: VersionSummary = {
    versionNumber: '1.0',
    lastUpdatedDate: '2023-05-15T08:21:03Z',
    versionState: DatasetVersionState.RELEASED
  }

  const metadataBlockDiff: MetadataBlockDiff = {
    blockName: 'citation',
    changed: [
      {
        fieldName: 'title',
        oldValue: 'Old Title',
        newValue: 'New Title'
      }
    ]
  }

  const fileSummary: FileSummary = {
    fileName: 'file1.txt',
    MD5: 'd41d8cd98f00b204e9800998ecf8427e',
    type: 'text/plain',
    fileId: 1,
    filePath: '/path/to/file1.txt',
    description: 'Test file',
    isRestricted: false,
    tags: ['tag1'],
    categories: ['category1']
  }

  const fileDiff: FileDiff = {
    fileName: 'file1.txt',
    md5: 'd41d8cd98f00b204e9800998ecf8427e',
    fileId: 1,
    changed: [
      {
        fieldName: 'description',
        oldValue: 'Old description',
        newValue: 'New description'
      }
    ]
  }

  const fileReplacement: FileReplacement = {
    oldFile: fileSummary,
    newFile: {
      ...fileSummary,
      fileName: 'file2.txt'
    }
  }

  const fieldDiff: FieldDiff = {
    fieldName: 'termsOfAccess',
    oldValue: 'Old terms',
    newValue: 'New terms'
  }

  return {
    oldVersion: versionSummary,
    newVersion: versionSummary,
    metadataChanges: [metadataBlockDiff],
    filesAdded: [fileSummary],
    filesRemoved: [fileSummary],
    fileChanges: [fileDiff],
    filesReplaced: [fileReplacement],
    termsOfAccess: { changed: [fieldDiff] }
  }
}
