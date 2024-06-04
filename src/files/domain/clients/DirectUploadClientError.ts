export class DirectUploadClientError extends Error {
  fileName: string
  datasetId: number | string

  constructor(fileName: string, datasetId: number | string, reason: string) {
    super(reason)
    this.datasetId = datasetId
    this.fileName = fileName
  }
}
