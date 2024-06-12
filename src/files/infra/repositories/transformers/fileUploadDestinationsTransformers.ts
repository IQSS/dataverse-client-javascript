import { AxiosResponse } from 'axios'
import { FileUploadDestination } from '../../../domain/models/FileUploadDestination'

export interface FileSingleUploadDestinationPayload {
  url: string
  partSize: number
  storageIdentifier: string
}

export interface FileMultipartUploadDestinationPayload {
  urls: Record<string, string>
  partSize: number
  storageIdentifier: string
  complete?: string
  abort?: string
}

export const transformUploadDestinationsResponseToUploadDestination = (
  response: AxiosResponse
): FileUploadDestination => {
  const fileUploadDestinationsPayload = response.data.data

  if (fileUploadDestinationsPayload.url !== undefined) {
    return {
      urls: [fileUploadDestinationsPayload.url],
      partSize: fileUploadDestinationsPayload.partSize,
      storageId: fileUploadDestinationsPayload.storageIdentifier
    }
  } else {
    return transformMultipartUploadDestinationsPayloadToMultipartUploadDestinationModel(
      fileUploadDestinationsPayload
    )
  }
}

export const transformMultipartUploadDestinationsPayloadToMultipartUploadDestinationModel = (
  fileUploadDestinationsPayload: FileMultipartUploadDestinationPayload
): FileUploadDestination => {
  const urls: string[] = []
  for (const urlKey of Object.keys(fileUploadDestinationsPayload.urls)) {
    urls.push(fileUploadDestinationsPayload.urls[urlKey])
  }
  return {
    urls: urls,
    partSize: fileUploadDestinationsPayload.partSize,
    storageId: fileUploadDestinationsPayload.storageIdentifier,
    abortEndpoint: fileUploadDestinationsPayload.abort?.substring(4),
    completeEndpoint: fileUploadDestinationsPayload.complete?.substring(4)
  }
}
