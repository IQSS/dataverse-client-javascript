import { FileUploadDestination } from '../../../src/files/domain/models/FileUploadDestination'
import {
  FileMultipartUploadDestinationPayload,
  FileSingleUploadDestinationPayload
} from '../../../src/files/infra/repositories/transformers/fileUploadDestinationsTransformers'

export const createSingleFileUploadDestinationPayload = (): FileSingleUploadDestinationPayload => {
  return {
    url: 'http://localstack:4566/mybucket/10.5072/FK2/PXR7TG/18f715d9fb1-db14df4c8070?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240513T095152Z&X-Amz-SignedHeaders=host%3Bx-amz-tagging&X-Amz-Expires=3599&X-Amz-Credential=default%2F20240513%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=b98bebb20201d05d08610d3cb366386eea078d852c3399c670aff8c66702fd02',
    partSize: 1073741824,
    storageIdentifier: 'localstack1://mybucket:18f715d9fb1-db14df4c8070'
  }
}

export const createSingleFileUploadDestinationModel = (): FileUploadDestination => {
  const singleFileUploadDestinationPayload = createSingleFileUploadDestinationPayload()
  return {
    url: singleFileUploadDestinationPayload.url,
    partSize: singleFileUploadDestinationPayload.partSize,
    storageId: singleFileUploadDestinationPayload.storageIdentifier
  }
}

export const createMultipartFileUploadDestinationPayload =
  (): FileMultipartUploadDestinationPayload => {
    return {
      urls: {
        '1': 'http://localstack:4566/mybucket/10.5072/FK2/PXR7TG/18f715da0f8-745c7b545756?uploadId=E9KZMX7EKJ2DvR701XU3Z0r3erhx5fimu5FPbsb9BqMrpzvs7psj4A&partNumber=1&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240513T095152Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=default%2F20240513%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=42bcaef988dab905ddabe9406fefd14e9d0d801cebce13a34a7349fd7b271694',
        '2': 'http://localstack:4566/mybucket/10.5072/FK2/PXR7TG/18f715da0f8-745c7b545756?uploadId=E9KZMX7EKJ2DvR701XU3Z0r3erhx5fimu5FPbsb9BqMrpzvs7psj4A&partNumber=2&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240513T095152Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=default%2F20240513%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=03df92ba4a70dcf1293bede19068536bf2ed95be3e1c0b67ff1731ff637ada11'
      },
      partSize: 1073741824,
      storageIdentifier: 'localstack1://mybucket:18f715da0f8-745c7b545756'
    }
  }

export const createMultipartFileUploadDestinationModels = (): FileUploadDestination[] => {
  const multipartFileUploadDestinationPayload = createMultipartFileUploadDestinationPayload()
  return [
    {
      url: multipartFileUploadDestinationPayload.urls['1'],
      partSize: multipartFileUploadDestinationPayload.partSize,
      storageId: multipartFileUploadDestinationPayload.storageIdentifier
    },
    {
      url: multipartFileUploadDestinationPayload.urls['2'],
      partSize: multipartFileUploadDestinationPayload.partSize,
      storageId: multipartFileUploadDestinationPayload.storageIdentifier
    }
  ]
}
