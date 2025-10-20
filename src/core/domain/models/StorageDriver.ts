export interface StorageDriver {
  name: string
  type: string
  label: string
  directUpload?: boolean // Only present when getting the storage driver of a dataset
  directDownload?: boolean // Only present when getting the storage driver of a dataset
}
