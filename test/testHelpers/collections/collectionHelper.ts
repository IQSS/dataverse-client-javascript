import { Collection, CollectionFacet } from '../../../src/collections'
import { DvObjectType } from '../../../src'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'
import { TestConstants } from '../TestConstants'
import axios from 'axios'
import { CollectionDTO, CollectionType } from '../../../src/collections/domain/dtos/CollectionDTO'
import { NewCollectionRequestPayload } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { CollectionFacetPayload } from '../../../src/collections/infra/repositories/transformers/CollectionFacetPayload'

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
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' },
    inputLevels: [
      {
        datasetFieldName: 'test',
        required: true,
        include: true
      }
    ]
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
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' },
    inputLevels: [
      {
        datasetFieldTypeName: 'test',
        required: true,
        include: true
      }
    ]
  }
  return collectionPayload
}

export async function createCollectionViaApi(
  collectionAlias: string,
  parentCollectionAlias: string | undefined = undefined
): Promise<CollectionPayload> {
  try {
    if (parentCollectionAlias == undefined) {
      parentCollectionAlias = 'root'
    }

    return await axios
      .post(
        `${TestConstants.TEST_API_URL}/dataverses/${parentCollectionAlias}`,
        JSON.stringify({
          alias: collectionAlias,
          name: 'Scientific Research',
          dataverseContacts: [
            {
              contactEmail: 'pi@example.edu'
            },
            {
              contactEmail: 'student@example.edu'
            }
          ],
          affiliation: 'Scientific Research University',
          description: 'We do all the science.',
          dataverseType: 'LABORATORY'
        }),
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
    console.log(error)
    throw new Error(`Error while deleting test collection ${collectionAlias}`)
  }
}

export async function setStorageDriverViaApi(
  collectionAlias: string,
  driverLabel: string
): Promise<void> {
  try {
    return await axios.put(
      `${TestConstants.TEST_API_URL}/admin/dataverse/${collectionAlias}/storageDriver`,
      driverLabel,
      {
        headers: { 'Content-Type': 'text/plain', 'X-Dataverse-Key': process.env.TEST_API_KEY }
      }
    )
  } catch (error) {
    console.log(error)
    throw new Error(`Error while setting storage driver for collection ${collectionAlias}`)
  }
}

export const createCollectionDTO = (alias = 'test-collection'): CollectionDTO => {
  return {
    alias: alias,
    name: 'Test Collection',
    contacts: ['dataverse@test.com'],
    type: CollectionType.DEPARTMENT,
    metadataBlockNames: ['citation', 'geospatial'],
    facetIds: ['authorName', 'authorAffiliation'],
    description: 'test description',
    affiliation: 'test affiliation',
    inputLevels: [
      {
        datasetFieldName: 'geographicCoverage',
        required: true,
        include: true
      }
    ]
  }
}

export const createNewCollectionRequestPayload = (): NewCollectionRequestPayload => {
  return {
    alias: 'test-collection',
    name: 'Test Collection',
    dataverseContacts: [
      {
        contactEmail: 'dataverse@test.com'
      }
    ],
    dataverseType: 'DEPARTMENT',
    description: 'test description',
    affiliation: 'test affiliation',
    metadataBlocks: {
      metadataBlockNames: ['citation', 'geospatial'],
      facetIds: ['authorName', 'authorAffiliation'],
      inputLevels: [
        {
          datasetFieldTypeName: 'geographicCoverage',
          include: true,
          required: true
        }
      ]
    }
  }
}

export const createCollectionFacetModel = (): CollectionFacet => {
  return {
    id: 1,
    name: 'testName',
    displayName: 'testDisplayName'
  }
}

export const createCollectionFacetRequestPayload = (): CollectionFacetPayload => {
  return {
    id: '1',
    name: 'testName',
    displayName: 'testDisplayName'
  }
}
