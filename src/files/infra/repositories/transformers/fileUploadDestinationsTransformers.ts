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
}

export const transformUploadDestinationsResponseToUploadDestinations = (
  response: AxiosResponse
): FileUploadDestination[] => {
  const fileUploadDestinationsPayload = response.data.data
  const fileUploadDestinations: FileUploadDestination[] = []

  if (fileUploadDestinationsPayload.url != undefined) {
    fileUploadDestinations.push({
      url: fileUploadDestinationsPayload.url,
      partSize: fileUploadDestinationsPayload.partSize,
      storageId: fileUploadDestinationsPayload.storageIdentifier
    })
  } else {
    for (const urlKey of Object.keys(fileUploadDestinationsPayload.urls)) {
      fileUploadDestinations.push({
        url: fileUploadDestinationsPayload.urls[urlKey],
        partSize: fileUploadDestinationsPayload.partSize,
        storageId: fileUploadDestinationsPayload.storageIdentifier
      })
    }
  }

  return fileUploadDestinations
}
