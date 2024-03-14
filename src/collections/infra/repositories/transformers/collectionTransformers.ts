import { Collection } from '../../../domain/models/Collection'
import { AxiosResponse } from 'axios'
import { CollectionPayload } from './CollectionPayload'

export const transformCollectionIdResponseToPayload = (response: AxiosResponse): Collection => {
  const collectionPayload = response.data.data
  return transformPayloadToCollection(collectionPayload)
}

const transformPayloadToCollection = (collectionPayload: CollectionPayload): Collection => {
  const collectionModel: Collection = {
    id: collectionPayload.id,
    alias: collectionPayload.alias,
    name: collectionPayload.name,
    affiliation: collectionPayload.affiliation
  }
  return collectionModel
}
