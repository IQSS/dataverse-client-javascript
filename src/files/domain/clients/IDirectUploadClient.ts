import { FileUploadDestination } from '../models/FileUploadDestination'

export interface IDirectUploadClient {
  uploadFile(
    datasetId: number | string,
    file: File,
    progress: (now: number) => void,
    abortController: AbortController,
    destination?: FileUploadDestination
  ): Promise<string>

  addUploadedFileToDataset(datasetId: number | string, file: File, storageId: string): Promise<void>
}
