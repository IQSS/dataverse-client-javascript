import axios, { AxiosRequestConfig } from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'
import fs from 'fs'
import FormData from 'form-data'
import { buildRequestConfig, buildRequestUrl } from '../../../core/infra/repositories/apiConfigBuilders'

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

  private async uploadMultipartFile(
    filePath: string,
    destination: FileUploadDestination
  ): Promise<void> {
    const fileBytes = fs.statSync(filePath).size
    const partMaxSize = destination.partSize
    const eTags: Record<number, string> = {}
    const maxRetries = 3
    const timeout = 10000

    const uploadPart = async (
      destinationUrl: string,
      index: number,
      retries: number = 0
    ): Promise<void> => {
      const formData = this.createFileSliceRequestFormData(filePath, partMaxSize, fileBytes, index)
      const config: AxiosRequestConfig = {
        headers: {
          ...formData.getHeaders()
        },
        timeout: timeout
      }

      try {
        const response = await axios.put(destinationUrl, formData, config)
        const eTag = response.headers['etag']
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

    await this.completeMultipartUpload(destination.completeEndpoint, eTags)
  }

  private createFileSliceRequestFormData(
    filePath: string,
    partMaxSize: number,
    fileBytes: number,
    index: number
  ): FormData {
    const partSize = Math.min(partMaxSize, fileBytes - index * partMaxSize)
    const offset = index * partMaxSize
    const fileSlice = fs.createReadStream(filePath, {
      start: offset,
      end: offset + partSize
    })
    const formData = new FormData()
    formData.append('file', fileSlice)
    return formData
  }

  private async completeMultipartUpload(
    completeEndpoint: string,
    eTags: Record<string, string>
  ): Promise<void> {
    console.log(JSON.stringify(eTags))
    return await axios.put(buildRequestUrl(completeEndpoint), JSON.stringify(eTags), buildRequestConfig(false, {}))
  }
}
