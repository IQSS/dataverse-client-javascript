import { Collection } from '../../../src/collections'
import { DvObjectType } from '../../../src'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'
import { TestConstants } from '../TestConstants'
import axios from 'axios'
import collectionJson1 from './test-collection-1.json'
import collectionJson2 from './test-collection-2.json'

const COLLECTION_ID = 11111
const COLLECTION_IS_RELEASED = 'true'
const COLLECTION_ALIAS_STR = 'secondCollection'
const COLLECTION_NAME_STR = 'Laboratory Research'
const COLLECTION_AFFILIATION_STR = 'Laboratory Research Corporation'

const COLLECTION_DESCRIPTION_HTML = 'This is an <b>example</b> collection used for testing.'
const COLLECTION_DESCRIPTION_MARKDOWN = 'This is an **example** collection used for testing.'

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export const createCollectionModel = (): Collection => {
  const collectionModel: Collection = {
    id: COLLECTION_ID,
    alias: COLLECTION_ALIAS_STR,
    name: COLLECTION_NAME_STR,
    isReleased: COLLECTION_IS_RELEASED,
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
    isReleased: COLLECTION_IS_RELEASED,
    affiliation: COLLECTION_AFFILIATION_STR,
    description: COLLECTION_DESCRIPTION_HTML,
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
  }
  return collectionPayload
}

export async function createCollectionViaApi(collectionAlias: string): Promise<CollectionPayload> {
  try {
    return await axios
      .post(
        `${TestConstants.TEST_API_URL}/dataverses/root`,
        collectionAlias == TestConstants.TEST_CREATED_COLLECTION_ALIAS_1
          ? collectionJson1
          : collectionJson2,
        DATAVERSE_API_REQUEST_HEADERS
      )
      .then((response) => response.data.data)
  } catch (error) {
    throw new Error(`Error while creating test collection ${collectionAlias}`)
  }
}

export async function deleteCollectionViaApi(collectionAlias: string): Promise<void> {
  try {
    return await axios.delete(
      `${TestConstants.TEST_API_URL}/dataverses/${collectionAlias}`,
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    throw new Error(`Error while deleting test collection ${collectionAlias}`)
  }
}
