import { Collection } from '../../../src/collections'
import { DvObjectType } from '../../../src'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'
import { TestConstants } from '../TestConstants'
import axios from 'axios'
import collectionJson from './test-collection-1.json'

const COLLECTION_ID = 11111
const COLLECTION_ALIAS_STR = 'secondCollection'
const COLLECTION_NAME_STR = 'Laboratory Research'
const COLLECTION_AFFILIATION_STR = 'Laboratory Research Corporation'
const COLLECTION_DESCRIPTION_STR = 'This is an example collection used for testing.'

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export const createCollectionModel = (): Collection => {
  const collectionModel: Collection = {
    id: COLLECTION_ID,
    alias: COLLECTION_ALIAS_STR,
    name: COLLECTION_NAME_STR,
    affiliation: COLLECTION_AFFILIATION_STR,
    description: COLLECTION_DESCRIPTION_STR,
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
    description: COLLECTION_DESCRIPTION_STR,
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
  }
  return collectionPayload
}

export async function createCollectionViaApi(): Promise<void> {
  return await axios.post(
    `${TestConstants.TEST_API_URL}/dataverses/root`,
    collectionJson,
    DATAVERSE_API_REQUEST_HEADERS
  )
}

export async function deleteCollectionViaApi(): Promise<void> {
  return await axios.delete(
    `${TestConstants.TEST_API_URL}/dataverses/${TestConstants.TEST_CREATED_COLLECTION_ALIAS}`,
    DATAVERSE_API_REQUEST_HEADERS
  )
}
