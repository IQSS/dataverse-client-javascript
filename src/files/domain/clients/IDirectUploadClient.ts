import { FileUploadDestination } from '../models/FileUploadDestination'

export interface IDirectUploadClient {
  uploadFile(filePath: string, destination: FileUploadDestination): Promise<void>
}
