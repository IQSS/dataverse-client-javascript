export interface MyDataDatasetPreviewPayload {
  name: string
  type: string
  global_id: string
  description: string
  publisher: string
  citationHtml: string
  identifier_of_dataverse: string
  name_of_dataverse: string
  publicationStatuses: string[]
  majorVersion: number
  minorVersion: number
  versionId: number
  versionState: string
  createdAt: string
  updatedAt: string
  publication_statuses: string[]
  user_roles: string[]
  image_url?: string
  published_at?: string
}
