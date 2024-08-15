export interface UploadedFileDTO {
  fileName: string
  description?: string
  directoryLabel?: string
  categories?: string[]
  restrict?: boolean
  storageId: string
  checksumValue: string
  checksumType: string
  mimeType: string
}
