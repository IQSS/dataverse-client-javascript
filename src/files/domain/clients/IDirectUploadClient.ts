import { FileUploadDestination } from '../models/FileUploadDestination'

export interface IDirectUploadClient {
  uploadFile(
    datasetId: number | string,
    file: File,
    destination?: FileUploadDestination
  ): Promise<void>
}
