import { PublicationStatus } from '../../../../core/domain/models/PublicationStatus'
import { FilePreview } from '../../../domain/models/FilePreview'
import { FilePreviewPayload } from './FilePreviewPayload'

export const transformFilePreviewPayloadToFilePreview = (
  filePreviewPayload: FilePreviewPayload
): FilePreview => {
  const publicationStatuses: PublicationStatus[] = []
  filePreviewPayload.publicationStatuses.forEach((element) => {
    publicationStatuses.push(element as unknown as PublicationStatus)
  })
  return {
    name: filePreviewPayload.name,
    url: filePreviewPayload.url,
    imageUrl: filePreviewPayload.image_url,
    ...(filePreviewPayload.image_url && { imageUrl: filePreviewPayload.image_url }),
    fileId: Number(filePreviewPayload.file_id),
    ...(filePreviewPayload.file_persistent_id && {
      filePersistentId: filePreviewPayload.file_persistent_id
    }),
    description: filePreviewPayload.description,
    fileType: filePreviewPayload.file_type,
    fileContentType: filePreviewPayload.file_content_type,
    sizeInBytes: filePreviewPayload.size_in_bytes,
    ...(filePreviewPayload.md5 && { md5: filePreviewPayload.md5 }),
    ...(filePreviewPayload.checksum && {
      checksum: {
        type: filePreviewPayload.checksum.type,
        value: filePreviewPayload.checksum.value
      }
    }),
    unf: filePreviewPayload.unf,
    datasetName: filePreviewPayload.dataset_name,
    datasetId: Number(filePreviewPayload.dataset_id),
    datasetPersistentId: filePreviewPayload.dataset_persistent_id,
    datasetCitation: filePreviewPayload.dataset_citation,
    publicationStatuses: publicationStatuses
  }
}
