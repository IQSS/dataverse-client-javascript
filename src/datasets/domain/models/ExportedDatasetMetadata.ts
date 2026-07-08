export type ExportedDatasetMetadata = {
  content: string
  contentType: string
}

export enum DatasetMetadataExportVersion {
  LATEST_PUBLISHED = ':latest-published',
  DRAFT = ':draft'
}
