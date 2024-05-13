import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileDTO } from '../../domain/dtos/FileDTO'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'

export class DirectUploadClient implements IDirectUploadClient {
  uploadFile(fileDTO: FileDTO, destinations: FileUploadDestination[]): Promise<void> {
    console.log(fileDTO, destinations)
    throw new Error('Method not implemented.')
  }
}
