import { FilePreviewChecksumPayload } from '../../../../../src/files/infra/repositories/transformers/FilePreviewPayload'

export interface MyDataFilePreviewPayload {
  name: string
  type: string
  url: string
  file_id: string
  file_type: string
  file_content_type: string
  size_in_bytes: number
  md5: string
  checksum: FilePreviewChecksumPayload
  unf: string
  dataset_name: string
  dataset_id: string
  dataset_persistent_id: string
  dataset_citation: string
  restricted: boolean
  canDownloadFile: boolean
  matches: string[]
  score: number
  entity_id: number
  publicationStatuses: string[]
  releaseOrCreateDate: string
  is_draft_state: boolean
  is_in_review_state: boolean
  is_unpublished_state: boolean
  is_published: boolean
  is_deaccesioned: boolean
  is_valid: boolean
  date_to_display_on_card: string
  parentIdentifier: string
  parentName: string
  user_roles: string[]
  image_url?: string
  variables?: number
  observations?: number
  file_persistent_id?: string
  description?: string
}
