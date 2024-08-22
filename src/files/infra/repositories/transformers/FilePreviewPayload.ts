export interface FilePreviewPayload {
  name: string
  url: string
  image_url?: string
  file_id: string
  file_persistent_id?: string
  description: string
  published_at?: string
  file_type: string
  file_content_type: string
  size_in_bytes: number
  md5: string
  checksum?: FilePreviewChecksumPayload
  type?: string
  unf: string
  dataset_name: string
  dataset_id: string
  dataset_persistent_id: string
  dataset_citation: string
  publicationStatuses: string[]
}

export interface FilePreviewChecksumPayload {
  type: string
  value: string
}
