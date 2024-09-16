export interface DatasetPreviewPayload {
  global_id: string
  name: string
  versionId: number
  majorVersion: number
  minorVersion: number
  versionState: string
  createdAt: string
  updatedAt: string
  published_at?: string
  citation: string
  description: string
  type?: string
  publicationStatuses: string[]
  identifier_of_dataverse: string
  name_of_dataverse: string
}
