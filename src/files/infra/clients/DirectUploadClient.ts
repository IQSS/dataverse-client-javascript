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
    return await axios.put(destination.urls[0], file, {
      headers: {
        'x-amz-tagging': 'dv-state=temp'
      }
    })
  }

  async uploadMultipartFile(file: File, destination: FileUploadDestination): Promise<void> {
    const fileBytes = file.size
    const partMaxSize = destination.partSize
    const eTags: Record<number, string> = {}
    const maxRetries = 3
    const timeout = 10000

    console.log(fileBytes + partMaxSize + maxRetries + timeout)

    // If fails, call abort endpoint

    // If success:
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
        throw error
      })
  }
}
