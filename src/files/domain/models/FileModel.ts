import { DvObjectOwnerNode, DvObjectType } from '../../../core/domain/models/DvObjectOwnerNode'

export interface FileModel {
  id: number
  persistentId: string
  name: string
  pidURL?: string
  sizeBytes: number
  version: number
  description?: string
  restricted: boolean
  latestRestricted: boolean
  directoryLabel?: string
  datasetVersionId?: number
  categories?: string[]
  contentType: string
  friendlyType: string
  embargo?: FileEmbargo
  storageIdentifier?: string
  originalFormat?: string
  originalFormatLabel?: string
  originalSize?: number
  originalName?: string
  UNF?: string
  rootDataFileId?: number
  previousDataFileId?: number
  md5?: string
  checksum?: FileChecksum
  metadataId?: number
  tabularTags?: string[]
  creationDate?: string
  publicationDate?: string
  /**
   * The timestamp of the last update to this file record.
   * Format: ISO 8601 string (e.g., "2023-06-01T12:34:56Z").
   * Used for optimistic concurrency control to detect concurrent updates.
   */
  lastUpdateTime: string
  deleted: boolean
  tabularData: boolean
  fileAccessRequest?: boolean
  isPartOf?: DvObjectOwnerNode
}

export interface FileEmbargo {
  dateAvailable: Date
  reason?: string
}

export interface FileChecksum {
  type: string
  value: string
}

const fileModelExample: FileModel = {
  id: 123,
  persistentId: 'doi:10.1234/example',
  name: 'data.csv',
  pidURL: 'http://example.com/file/123',
  sizeBytes: 2048,
  version: 1,
  description: 'Sample data file',
  restricted: false,
  latestRestricted: false,
  directoryLabel: '/data',
  datasetVersionId: 1,
  categories: ['survey', 'demographics'],
  contentType: 'text/csv',
  friendlyType: 'CSV',
  embargo: {
    dateAvailable: new Date('2024-12-31'),
    reason: 'Embargo until publication'
  },
  storageIdentifier: 's3://bucket/key',
  originalFormat: 'csv',
  originalFormatLabel: 'CSV',
  originalSize: 2048,
  originalName: 'data_original.csv',
  UNF: 'UNF:6:abc123',
  rootDataFileId: 123,
  previousDataFileId: 122,
  md5: 'd41d8cd98f00b204e9800998ecf8427e',
  checksum: {
    type: 'MD5',
    value: 'd41d8cd98f00b204e9800998ecf8427e'
  },
  metadataId: 456,
  tabularTags: ['tabular', 'data'],
  creationDate: '2024-01-01T12:00:00Z',
  publicationDate: '2024-06-01T12:00:00Z',
  lastUpdateTime: '2024-06-15T12:34:56Z',
  deleted: false,
  tabularData: true,
  fileAccessRequest: false,
  isPartOf: {
    type: 'dataverse' as DvObjectType,
    displayName: 'My Dataverse',
    identifier: 'my-dataverse'
  }
}

fileModelExample.lastUpdateTime
