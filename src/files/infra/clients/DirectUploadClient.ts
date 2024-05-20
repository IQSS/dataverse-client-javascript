import axios from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'
import fs from 'fs'
import FormData from 'form-data'

export class DirectUploadClient implements IDirectUploadClient {
  public async uploadFile(filePath: string, destination: FileUploadDestination): Promise<void> {
    if (destination.urls.length === 1) {
      return this.uploadSinglepartFile(filePath, destination)
    }
    return this.uploadMultipartFile(filePath, destination)
  }

  private async uploadSinglepartFile(
    filePath: string,
    destination: FileUploadDestination
  ): Promise<void> {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))
    return await axios.put(destination.urls[0], formData, {
      headers: {
        ...formData.getHeaders(),
        'x-amz-tagging': 'dv-state=temp'
      }
    })
  }

  private uploadMultipartFile(filePath: string, destination: FileUploadDestination): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const fileBytes = fs.statSync(filePath).size
      const partMaxSize = destination.partSize
      let eTags: Record<number, string> = {}

      const uploadPromises = destination.urls.map(async (destinationUrl, index) => {
        const formData = this.createFileSliceRequestFormData(
          filePath,
          partMaxSize,
          fileBytes,
          index
        )
        try {
          const response = await axios.put(destinationUrl, formData, {
            headers: {
              ...formData.getHeaders()
            }
          })
          // TODO
          console.log('multipart response')
          console.log(response)
          const eTag = response.headers['etag']
          eTags[index + 1] = eTag
          console.log('etag')
          console.log(eTag)
          if (Object.keys(eTags).length === destination.urls.length) {
            resolve()
          }
        } catch (error) {
          reject(error)
        }
      })

      Promise.all(uploadPromises)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private createFileSliceRequestFormData(
    filePath: string,
    partMaxSize: number,
    fileBytes: number,
    index: number
  ): FormData {
    const partSize = Math.min(partMaxSize, fileBytes - index * partMaxSize)
    var offset = index * partMaxSize
    const fileSlice = fs.createReadStream(filePath, {
      start: offset,
      end: offset + partSize
    })
    const formData = new FormData()
    formData.append('file', fileSlice)
    return formData
  }
}
