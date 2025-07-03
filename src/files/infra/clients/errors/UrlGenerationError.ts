import { DirectUploadClientError } from '../../../domain/clients/DirectUploadClientError'

export class UrlGenerationError extends DirectUploadClientError {
  constructor(fileName: string, datasetId: number | string, reason: string) {
    super(fileName, datasetId, reason)
  }
}
