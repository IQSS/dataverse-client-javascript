import { DirectUploadClientError } from '../../../domain/clients/DirectUploadClientError'

export class FileUploadCancelError extends DirectUploadClientError {
  constructor(fileName: string, datasetId: number | string) {
    super(fileName, datasetId, 'Upload aborted')
  }
}
