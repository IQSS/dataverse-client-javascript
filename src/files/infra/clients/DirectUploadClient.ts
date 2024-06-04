import axios from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'
import pLimit from 'p-limit'
import {
  buildRequestConfig,
  buildRequestUrl
} from '../../../core/infra/repositories/apiConfigBuilders'
import * as crypto from 'crypto'
import { IFilesRepository } from '../../domain/repositories/IFilesRepository'
import { FileUploadError } from './errors/FileUploadError'
import { FilePartUploadError } from './errors/FilePartUploadError'
import { MultipartCompletionError } from './errors/MultipartCompletionError'
import { AddUploadedFileToDatasetError } from './errors/AddUploadedFileToDatasetError'
import { UrlGenerationError } from './errors/UrlGenerationError'

export class DirectUploadClient implements IDirectUploadClient {
  private filesRepository: IFilesRepository

  private readonly checksumAlgorithm: string = 'md5'

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository
  }

  public async uploadFile(
    datasetId: number | string,
    file: File,
    destination?: FileUploadDestination
  ): Promise<void> {
    if (destination == undefined) {
      destination = await this.filesRepository
        .getFileUploadDestination(datasetId, file)
        .catch((error) => {
          throw new UrlGenerationError(file.name, datasetId, error.message)
        })
    }

    if (destination.urls.length === 1) {
      await this.uploadSinglepartFile(datasetId, file, destination)
    } else {
      await this.uploadMultipartFile(datasetId, file, destination)
    }

    return await this.addUploadedFileToDataset(datasetId, file, destination.storageId)
  }

  private async uploadSinglepartFile(
    datasetId: number | string,
    file: File,
    destination: FileUploadDestination
  ): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      await axios.put(destination.urls[0], arrayBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': file.size.toString(),
          'x-amz-tagging': 'dv-state=temp'
        },
        timeout: 60000
      })
    } catch (error) {
      throw new FileUploadError(file.name, datasetId, error.message)
    }
  }

  async uploadMultipartFile(
    datasetId: number | string,
    file: File,
    destination: FileUploadDestination
  ): Promise<void> {
    const partMaxSize = destination.partSize
    const eTags: Record<number, string> = {}
    const maxRetries = 10
    const limitConcurrency = pLimit(1)

    const uploadPart = async (
      destinationUrl: string,
      index: number,
      retries = 0
    ): Promise<void> => {
      const offset = index * partMaxSize
      const partSize = Math.min(partMaxSize, file.size - offset)
      const fileSlice = file.slice(offset, offset + partSize)

      try {
        const response = await axios.put(destinationUrl, fileSlice, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': fileSlice.size
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 60000
        })
        const eTag = response.headers['etag'].replace(/"/g, '')
        eTags[`${index + 1}`] = eTag
      } catch (error) {
        if (retries < maxRetries) {
          const backoffDelay = Math.pow(2, retries) * 1000
          console.warn(`Retrying part ${index + 1}, attempt ${retries + 1} after ${backoffDelay}ms`)
          await new Promise((resolve) => setTimeout(resolve, backoffDelay))
          await uploadPart(destinationUrl, index, retries + 1)
        } else {
          // TODO CALL ABORT ENDPOINT
          throw new FilePartUploadError(file.name, datasetId, error.message, index + 1)
        }
      }
    }

    const uploadPromises = destination.urls.map((destinationUrl, index) =>
      limitConcurrency(() => uploadPart(destinationUrl, index))
    )

    await Promise.all(uploadPromises)

    return await this.completeMultipartUpload(
      file.name,
      datasetId,
      destination.completeEndpoint,
      eTags
    )
  }

  private async completeMultipartUpload(
    fileName: string,
    datasetId: number | string,
    completeEndpoint: string,
    eTags: Record<string, string>
  ): Promise<void> {
    return await axios
      .put(buildRequestUrl(completeEndpoint), eTags, buildRequestConfig(true, {}))
      .then(() => undefined)
      .catch((error) => {
        throw new MultipartCompletionError(fileName, datasetId, error.message)
      })
  }

  private async addUploadedFileToDataset(
    datasetId: number | string,
    file: File,
    storageId: string
  ): Promise<void> {
    const fileArrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(fileArrayBuffer)
    return await this.filesRepository
      .addUploadedFileToDataset(datasetId, {
        fileName: file.name,
        storageId: storageId,
        checksumType: this.checksumAlgorithm,
        checksumValue: this.calculateBlobChecksum(fileBuffer),
        mimeType: file.type
      })
      .then(() => undefined)
      .catch((error) => {
        throw new AddUploadedFileToDatasetError(file.name, datasetId, error.message)
      })
  }

  private calculateBlobChecksum(blob: Buffer): string {
    const hash = crypto.createHash(this.checksumAlgorithm)
    hash.update(blob)
    return hash.digest('hex')
  }
}
