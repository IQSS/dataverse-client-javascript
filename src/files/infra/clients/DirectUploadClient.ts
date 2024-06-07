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
import { MultipartAbortError } from './errors/MultipartAbortError'
import { FileUploadCancelError } from './errors/FileUploadCancelError'
import { ApiConstants } from '../../../core/infra/repositories/ApiConstants'

export class DirectUploadClient implements IDirectUploadClient {
  private filesRepository: IFilesRepository
  private maxMultipartRetries: number

  private readonly checksumAlgorithm: string = 'md5'

  private readonly progressAfterUrlGeneration: number = 10
  private readonly progressAfterFileUpload: number = 100

  constructor(filesRepository: IFilesRepository, maxMultipartRetries = 5) {
    this.filesRepository = filesRepository
    this.maxMultipartRetries = maxMultipartRetries
  }

  public async uploadFile(
    datasetId: number | string,
    file: File,
    progress: (now: number) => void,
    abortController: AbortController,
    destination?: FileUploadDestination
  ): Promise<void> {
    if (destination == undefined) {
      destination = await this.filesRepository
        .getFileUploadDestination(datasetId, file)
        .catch((error) => {
          throw new UrlGenerationError(file.name, datasetId, error.message)
        })
    }
    progress(this.progressAfterUrlGeneration)

    if (destination.urls.length === 1) {
      await this.uploadSinglepartFile(datasetId, file, destination, abortController)
      progress(this.progressAfterFileUpload)
    } else {
      await this.uploadMultipartFile(datasetId, file, destination, progress, abortController)
    }
  }

  private async uploadSinglepartFile(
    datasetId: number | string,
    file: File,
    destination: FileUploadDestination,
    abortController: AbortController
  ): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      await axios.put(destination.urls[0], arrayBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': file.size.toString(),
          'x-amz-tagging': 'dv-state=temp'
        },
        timeout: 60000,
        signal: abortController.signal
      })
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new FileUploadCancelError(file.name, datasetId)
      }
      throw new FileUploadError(file.name, datasetId, error.message)
    }
  }

  private async uploadMultipartFile(
    datasetId: number | string,
    file: File,
    destination: FileUploadDestination,
    progress: (now: number) => void,
    abortController: AbortController
  ): Promise<void> {
    const partMaxSize = destination.partSize
    const eTags: Record<number, string> = {}
    const maxRetries = this.maxMultipartRetries
    const limitConcurrency = pLimit(1)

    const progressPartSize = 80 / destination.urls.length

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
          timeout: 60000,
          signal: abortController.signal
        })
        const eTag = response.headers['etag'].replace(/"/g, '')
        eTags[`${index + 1}`] = eTag
        progress(this.progressAfterUrlGeneration + progressPartSize * (index + 1))
      } catch (error) {
        if (axios.isCancel(error)) {
          await this.abortMultipartUpload(file.name, datasetId, destination.abortEndpoint)
          throw new FileUploadCancelError(file.name, datasetId)
        }
        if (retries < maxRetries) {
          const backoffDelay = Math.pow(2, retries) * 1000
          await new Promise((resolve) => setTimeout(resolve, backoffDelay))
          await uploadPart(destinationUrl, index, retries + 1)
        } else {
          await this.abortMultipartUpload(file.name, datasetId, destination.abortEndpoint)
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
      destination,
      eTags,
      abortController
    ).then(() => {
      progress(this.progressAfterFileUpload)
      undefined
    })
  }

  private async abortMultipartUpload(
    fileName: string,
    datasetId: number | string,
    abortEndpoint: string
  ): Promise<void> {
    return await axios
      .delete(buildRequestUrl(abortEndpoint), buildRequestConfig(true, {}))
      .then(() => undefined)
      .catch((error) => {
        throw new MultipartAbortError(fileName, datasetId, error.message)
      })
  }

  private async completeMultipartUpload(
    fileName: string,
    datasetId: number | string,
    destination: FileUploadDestination,
    eTags: Record<string, string>,
    abortController: AbortController
  ): Promise<void> {
    return await axios
      .put(
        buildRequestUrl(destination.completeEndpoint),
        eTags,
        buildRequestConfig(
          true,
          {},
          ApiConstants.CONTENT_TYPE_APPLICATION_JSON,
          abortController.signal
        )
      )
      .then(() => undefined)
      .catch(async (error) => {
        if (axios.isCancel(error)) {
          await this.abortMultipartUpload(fileName, datasetId, destination.abortEndpoint)
          throw new FileUploadCancelError(fileName, datasetId)
        }
        throw new MultipartCompletionError(fileName, datasetId, error.message)
      })
  }

  public async addUploadedFileToDataset(
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
