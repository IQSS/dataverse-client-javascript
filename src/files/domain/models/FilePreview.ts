import { PublicationStatus } from '../../../core/domain/models/PublicationStatus'

export interface FilePreview {
  name: string
  url: string
  imageUrl?: string
  fileId: number
  filePersistentId?: string
  description: string
  fileType: string
  fileContentType: string
  sizeInBytes: number
  md5?: string
  checksum?: FilePreviewChecksum
  unf: string
  datasetName: string
  datasetId: number
  datasetPersistentId: string
  datasetCitation: string
  publicationStatuses: PublicationStatus[]
  releaseOrCreateDate: Date
}

export interface FilePreviewChecksum {
  type: string
  value: string
}
