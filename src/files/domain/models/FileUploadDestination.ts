export interface FileUploadDestination {
  urls: string[]
  storageId: string
  partSize: number
  abortEndpoint?: string
  completeEndpoint?: string
}
