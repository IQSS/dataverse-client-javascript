export interface UpdateFileMetadataDTO {
  label?: string
  directoryLabel?: string
  description?: string
  prevFreeform?: string
  categories?: string[]
  dataFileTags?: string[]
  restrict?: boolean
}
