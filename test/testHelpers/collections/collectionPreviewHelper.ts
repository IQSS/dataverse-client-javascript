import { CollectionPreview } from '../../../src'
import { CollectionPreviewPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPreviewPayload'
import { PublicationStatus } from '../../../src/core/domain/models/PublicationStatus'

export const createCollectionPreviewModel = (): CollectionPreview => {
  const collectionPreviewModel: CollectionPreview = {
    name: 'test collection',
    parentName: 'parent collection',
    alias: 'testcollection',
    parentAlias: 'parentcollection',
    description: 'test description',
    affiliation: 'test affiliation',
    publicationStatuses: [PublicationStatus.Published],
    releaseOrCreateDate: new Date('2023-05-15T08:21:01Z'),
    imageUrl: 'http://dataverse.com'
  }
  return collectionPreviewModel
}

export const createCollectionPreviewPayload = (): CollectionPreviewPayload => {
  return {
    name: 'test collection',
    parentDataverseName: 'parent collection',
    identifier: 'testcollection',
    parentDataverseIdentifier: 'parentcollection',
    description: 'test description',
    affiliation: 'test affiliation',
    publicationStatuses: ['Published'],
    published_at: '2023-05-15T08:21:01Z',
    image_url: 'http://dataverse.com',
    type: 'dataverse',
    url: 'http://dataverse.com'
  }
}
