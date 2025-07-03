export interface CollectionPreviewPayload {
  name: string
  parentDataverseName: string
  identifier: string
  parentDataverseIdentifier: string
  url: string
  image_url: string
  description: string
  type?: string
  publicationStatuses: string[]
  affiliation: string
  published_at: string
}
