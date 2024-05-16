import { FileUploadDestination } from '../models/FileUploadDestination'

export interface IDirectUploadClient {
  uploadFile(filePath: string, destinations: FileUploadDestination[]): Promise<void>
}
