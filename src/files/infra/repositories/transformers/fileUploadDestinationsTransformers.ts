import { AxiosResponse } from "axios"
import { FileUploadDestination } from "../../../domain/models/FileUploadDestination"

export interface FileUploadDestinationPayload {
    url: string,
    partSize: number,
    storageId: string
}

export const transformUploadDestinationsResponseToUploadDestinations = (response: AxiosResponse): FileUploadDestination[] => {
    console.log(response)
    
    const fileUploadDestinationsPayload = response.data.data
    const fileUploadDestinations: FileUploadDestination[] = []

    if (fileUploadDestinationsPayload.url != undefined) {
        fileUploadDestinations.push(
            {
                url: fileUploadDestinationsPayload.url,
                partSize: fileUploadDestinationsPayload.partSize,
                storageId: fileUploadDestinationsPayload.storageId
            }
        )
    } else {
        for (const urlKey of Object.keys(fileUploadDestinationsPayload.urls)) {
            fileUploadDestinations.push(
                {
                    url: fileUploadDestinationsPayload.urls[urlKey].url,
                    partSize: fileUploadDestinationsPayload.urls[urlKey].partSize,
                    storageId: fileUploadDestinationsPayload.urls[urlKey].storageId
                }
            )
        }
    }

    return fileUploadDestinations
}
