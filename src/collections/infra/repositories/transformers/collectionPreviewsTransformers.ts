import { PublicationStatus } from '../../../../core/domain/models/PublicationStatus'
import { CollectionItemType } from '../../../../collections/domain/models/CollectionItemType'
import { CollectionPreview } from '../../../domain/models/CollectionPreview'
import { CollectionPreviewPayload } from './CollectionPreviewPayload'

export const transformCollectionPreviewPayloadToCollectionPreview = (
  collectionPreviewPayload: CollectionPreviewPayload
): CollectionPreview => {
  const publicationStatuses: PublicationStatus[] = []
  collectionPreviewPayload.publicationStatuses.forEach((element) => {
    publicationStatuses.push(element as unknown as PublicationStatus)
  })
  return {
    type: CollectionItemType.COLLECTION,
    name: collectionPreviewPayload.name,
    parentName: collectionPreviewPayload.parentDataverseName,
    alias: collectionPreviewPayload.identifier,
    parentAlias: collectionPreviewPayload.parentDataverseIdentifier,
    description: collectionPreviewPayload.description,
    publicationStatuses: publicationStatuses,
    affiliation: collectionPreviewPayload.affiliation,
    ...(collectionPreviewPayload.image_url && {
      imageUrl: collectionPreviewPayload.image_url
    }),
    releaseOrCreateDate: new Date(collectionPreviewPayload.published_at)
  }
}
