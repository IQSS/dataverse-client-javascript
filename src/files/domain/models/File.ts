export interface File {
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
  creationDate?: Date
  publicationDate?: Date
  deleted: boolean
  tabularData: boolean
  fileAccessRequest?: boolean
}

export interface FileEmbargo {
  dateAvailable: Date
  reason?: string
}

export interface FileChecksum {
  type: string
  value: string
}
