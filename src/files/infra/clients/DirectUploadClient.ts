import axios from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'

export class DirectUploadClient implements IDirectUploadClient {
    public async uploadFile(filePath: string, destinations: FileUploadDestination[]): Promise<void> {
        console.log(filePath)
        if (destinations.length === 1) {
            return await axios.put(destinations[0].url, filePath, {
                headers: {
                    'x-amz-tagging': 'dv-state=temp'
                },
            }).then(() => {
                //console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        } else {
            throw new Error('Method not implemented.');
        }
    }
}
