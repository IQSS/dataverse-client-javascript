import { CollectionItemType, FilePreview } from '../../../src'
import { PublicationStatus } from '../../../src/core/domain/models/PublicationStatus'
import { FilePreviewPayload } from '../../../src/files/infra/repositories/transformers/FilePreviewPayload'

export const createFilePreviewModel = (): FilePreview => {
  const filePreviewModel: FilePreview = {
    type: CollectionItemType.FILE,
    name: 'test file',
    url: 'http://dataverse.com',
    imageUrl: 'http://dataverseimage.com',
    fileId: 2,
    filePersistentId: 'test pid2',
    description: 'test description',
    fileType: 'testtype',
    fileContentType: 'test/type',
    sizeInBytes: 10,
    md5: 'testmd5',
    checksum: {
      type: 'md5',
      value: 'testmd5'
    },
    unf: 'testunf',
    datasetName: 'test dataset',
    datasetId: 1,
    datasetPersistentId: 'test pid1',
    datasetCitation: 'test citation',
    publicationStatuses: [PublicationStatus.Published],
    releaseOrCreateDate: new Date('2023-05-15T08:21:01Z')
  }
  return filePreviewModel
}

export const createFilePreviewPayload = (): FilePreviewPayload => {
  return {
    name: 'test file',
    url: 'http://dataverse.com',
    image_url: 'http://dataverseimage.com',
    file_id: '2',
    file_persistent_id: 'test pid2',
    description: 'test description',
    file_type: 'testtype',
    file_content_type: 'test/type',
    size_in_bytes: 10,
    md5: 'testmd5',
    checksum: {
      type: 'md5',
      value: 'testmd5'
    },
    type: 'file',
    unf: 'testunf',
    dataset_name: 'test dataset',
    dataset_id: '1',
    dataset_persistent_id: 'test pid1',
    dataset_citation: 'test citation',
    publicationStatuses: ['Published'],
    releaseOrCreateDate: '2023-05-15T08:21:01Z'
  }
}
