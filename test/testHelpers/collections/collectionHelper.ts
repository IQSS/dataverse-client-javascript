import { Collection } from '../../../src/collections'

const COLLECTION_ID = 11111
const COLLECTION_NAME_STR = 'Laboratory Research'
const COLLECTION_ALIAS_STR = 'secondCollection'
const COLLECTION_AFFILIATION_STR = 'Laboratory Research Corporation'

export const createCollectionModel = (): Collection => {
  const collectionModel: Collection = {
    id: COLLECTION_ID,
    name: COLLECTION_NAME_STR,
    alias: COLLECTION_ALIAS_STR,
    affiliation: COLLECTION_AFFILIATION_STR
  }
  return collectionModel
}
