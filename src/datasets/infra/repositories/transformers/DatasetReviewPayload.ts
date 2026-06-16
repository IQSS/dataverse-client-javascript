export interface DatasetReviewPayload {
  title: string
  authors?: string[]
  persistentId: string
  persistentIdUrl: string
  id: number
  citation: string
  citationHtml: string
  datePublished?: string
  description?: string
  rubricMetadataBlocks?: DatasetReviewRubricMetadataBlockPayload[]
}

export interface DatasetReviewRubricMetadataBlockPayload {
  name: string
  displayName: string
  fields?: DatasetReviewRubricMetadataFieldPayload[]
}

export interface DatasetReviewRubricMetadataFieldPayload {
  typeName: string
  value: unknown
}
