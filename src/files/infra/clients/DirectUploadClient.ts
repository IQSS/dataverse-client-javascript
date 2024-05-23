import axios from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'
import {
  buildRequestConfig,
  buildRequestUrl
} from '../../../core/infra/repositories/apiConfigBuilders'

export class DirectUploadClient implements IDirectUploadClient {
  public async uploadFile(file: File, destination: FileUploadDestination): Promise<void> {
    if (destination.urls.length === 1) {
      return this.uploadSinglepartFile(file, destination)
    }
    return this.uploadMultipartFile(file, destination)
  }

  private async uploadSinglepartFile(
    file: File,
    destination: FileUploadDestination
  ): Promise<void> {
    const formData = new FormData()
    formData.append('file', file, file.name)
    await axios
      .put(destination.urls[0], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-amz-tagging': 'dv-state=temp'
        }
      })
      .then((response) => {
        console.log(response)
      })
  }

  async uploadMultipartFile(file: File, destination: FileUploadDestination): Promise<void> {
    const partMaxSize = destination.partSize
    const eTags: Record<number, string> = {}
    const maxRetries = 3

    const uploadPart = async (
      destinationUrl: string,
      index: number,
      retries: number = 0
    ): Promise<void> => {
      const offset = index * partMaxSize
      const partSize = Math.min(partMaxSize, file.size - offset)

      const fileSlice = file.slice(offset, offset + partSize)

      const formData = new FormData()
      formData.append('file', fileSlice, fileSlice.name)

      try {
        const response = await axios.put(destinationUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            maxBodyLength: Infinity,
            maxContentLength: Infinity
          }
        })
        console.log(response)
        const eTag = response.headers['etag'].replace(/"/g, '')
        eTags[`${index + 1}`] = eTag
      } catch (error) {
        if (retries < maxRetries) {
          console.warn(`Retrying part ${index + 1}, attempt ${retries + 1}`)
          await uploadPart(destinationUrl, index, retries + 1)
        } else {
          throw new Error(`Error uploading part ${index + 1}: ${error.message}`)
        }
      }
    }

    const promises = destination.urls.map((destinationUrl, index) =>
      uploadPart(destinationUrl, index)
    )

    await Promise.all(promises)

    return await this.completeMultipartUpload(destination.completeEndpoint, eTags)
  }

  private async completeMultipartUpload(
    completeEndpoint: string,
    eTags: Record<string, string>
  ): Promise<void> {
    return await axios
      .put(buildRequestUrl(completeEndpoint), eTags, buildRequestConfig(true, {}))
      .then(() => undefined)
      .catch((error) => {
        console.log(error)
      })
  }
}
