import { Collection } from '../../../domain/models/Collection'
import { AxiosResponse } from 'axios'
import { CollectionPayload } from './CollectionPayload'
import { transformPayloadToOwnerNode } from '../../../../core/infra/repositories/transformers/dvObjectOwnerNodeTransformer'

export const transformCollectionIdResponseToPayload = (response: AxiosResponse): Collection => {
  const collectionPayload = response.data.data
  return transformPayloadToCollection(collectionPayload)
}

const transformPayloadToCollection = (collectionPayload: CollectionPayload): Collection => {
  const collectionModel: Collection = {
    id: collectionPayload.id,
    alias: collectionPayload.alias,
    name: collectionPayload.name,
    affiliation: collectionPayload.affiliation,
    description: collectionPayload.description,
    isPartOf: transformPayloadToOwnerNode(collectionPayload.isPartOf)
  }
  return collectionModel
}
