import axios from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'
import fs from 'fs'
import FormData from 'form-data'

export class DirectUploadClient implements IDirectUploadClient {
  public async uploadFile(filePath: string, destination: FileUploadDestination): Promise<void> {
    if (destination.urls.length === 1) {
      return this.uploadSinglepartFile(filePath, destination)
    } else {
      return this.uploadMultipartFile(filePath, destination)
    }
  }

  private async uploadSinglepartFile(filePath: string, destination: FileUploadDestination): Promise<void> {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))
    return await axios
      .put(destination.urls[0], formData, {
        headers: {
          ...formData.getHeaders(),
          'x-amz-tagging': 'dv-state=temp'
        }
      })
  }

  private async uploadMultipartFile(filePath: string, destination: FileUploadDestination): Promise<void> {
    console.log(filePath)
    destination.urls.forEach(destinationUrl => {
      console.log(destinationUrl)
    });
  }
}
