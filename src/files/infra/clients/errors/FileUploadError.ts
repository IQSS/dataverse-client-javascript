import { DirectUploadClientError } from '../../../domain/clients/DirectUploadClientError'

export class FileUploadError extends DirectUploadClientError {
  constructor(fileName: string, datasetId: number | string, reason: string) {
    super(fileName, datasetId, reason)
  }
}
