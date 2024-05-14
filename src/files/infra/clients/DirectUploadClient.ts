import axios from 'axios'
import { IDirectUploadClient } from '../../domain/clients/IDirectUploadClient'
import { FileDTO } from '../../domain/dtos/FileDTO'
import { FileUploadDestination } from '../../domain/models/FileUploadDestination'

export class DirectUploadClient implements IDirectUploadClient {
    uploadFile(fileDTO: FileDTO, destinations: FileUploadDestination[]): Promise<void> {
        if (destinations.length == 1) {
            const formData = new FormData();
            formData.append('file', fileDTO.filename);
            return axios.put(
                destinations[0].url,
                fileDTO.filename,
                {
                    headers: {
                        'x-amz-tagging': 'dv-state=temp',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
        } else {
            throw new Error('Method not implemented.')
        }
    }
}
