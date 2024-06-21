import { DirectUploadClientError } from '../../../domain/clients/DirectUploadClientError'

export class FilePartUploadError extends DirectUploadClientError {
  partNumber: number

  constructor(fileName: string, datasetId: number | string, reason: string, partNumber: number) {
    super(fileName, datasetId, reason)
    this.partNumber = partNumber
  }
}
