import axios from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'
import fs from 'fs'
import FormData from 'form-data'

export class DirectUploadClient implements IDirectUploadClient {
  public async uploadFile(filePath: string, destinations: FileUploadDestination[]): Promise<void> {
    if (destinations.length === 1) {
      const formData = new FormData()
      formData.append('file', fs.createReadStream(filePath))

      return await axios
        .put(destinations[0].url, formData, {
          headers: {
            ...formData.getHeaders(),
            'x-amz-tagging': 'dv-state=temp'
          }
        })
        .then((response) => console.log(response))
        .catch((error) => {
          console.log(error)
        })
    } else {
      throw new Error('Method not implemented.')
    }
  }
}
