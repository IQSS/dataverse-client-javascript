import { FileUploadDestination } from '../models/FileUploadDestination'

export interface IDirectUploadClient {
  uploadFile(file: File, destination: FileUploadDestination): Promise<void>
}
