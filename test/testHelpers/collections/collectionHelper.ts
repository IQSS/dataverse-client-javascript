import { Collection } from '../../../src/collections'

const COLLECTION_ID = 11111
const COLLECTION_ALIAS_STR = 'secondCollection'
const COLLECTION_NAME_STR = 'Laboratory Research'
const COLLECTION_AFFILIATION_STR = 'Laboratory Research Corporation'
const COLLECTION_DESCRIPTION_STR = 'This is an example collection used for testing.'

export const createCollectionModel = (): Collection => {
  const collectionModel: Collection = {
    id: COLLECTION_ID,
    alias: COLLECTION_ALIAS_STR,
    name: COLLECTION_NAME_STR,
    affiliation: COLLECTION_AFFILIATION_STR,
    description: COLLECTION_DESCRIPTION_STR
  }
  return collectionModel
}
