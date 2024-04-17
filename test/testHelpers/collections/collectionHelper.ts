import { Collection } from '../../../src/collections'
import { DvObjectType } from '../../../src'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'

const COLLECTION_ID = 11111
const COLLECTION_ALIAS_STR = 'secondCollection'
const COLLECTION_NAME_STR = 'Laboratory Research'
const COLLECTION_AFFILIATION_STR = 'Laboratory Research Corporation'
const COLLECTION_DESCRIPTION_HTML = 'This is an <b>example</b> collection used for testing.'
const COLLECTION_DESCRIPTION_MARKDOWN = 'This is an **example** collection used for testing.'
export const createCollectionModel = (): Collection => {
  const collectionModel: Collection = {
    id: COLLECTION_ID,
    alias: COLLECTION_ALIAS_STR,
    name: COLLECTION_NAME_STR,
    affiliation: COLLECTION_AFFILIATION_STR,
    description: COLLECTION_DESCRIPTION_MARKDOWN,
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
  }
  return collectionModel
}

export const createCollectionPayload = (): CollectionPayload => {
  const collectionPayload: CollectionPayload = {
    id: COLLECTION_ID,
    alias: COLLECTION_ALIAS_STR,
    name: COLLECTION_NAME_STR,
    affiliation: COLLECTION_AFFILIATION_STR,
    description: COLLECTION_DESCRIPTION_HTML,
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
  }
  return collectionPayload
}
