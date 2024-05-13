import { FileDTO } from '../dtos/FileDTO'
import { FileUploadDestination } from '../models/FileUploadDestination'

export interface IDirectUploadClient {
  uploadFile(fileDTO: FileDTO, destinations: FileUploadDestination[]): Promise<void>
}
