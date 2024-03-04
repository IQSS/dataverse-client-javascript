import {
  Dataset,
  DatasetVersionState,
  DatasetLicense
} from '../../../src/datasets/domain/models/Dataset'
import axios, { AxiosResponse } from 'axios'
import { TestConstants } from '../TestConstants'
import { DatasetPayload } from '../../../src/datasets/infra/repositories/transformers/DatasetPayload'
import { DvObjectType } from '../../../src/core/domain/models/DvObjectOwnerNode'
import TurndownService from 'turndown'

const turndownService = new TurndownService()
const DATASET_CREATE_TIME_STR = '2023-05-15T08:21:01Z'
const DATASET_UPDATE_TIME_STR = '2023-05-15T08:21:03Z'
const DATASET_RELEASE_TIME_STR = '2023-05-15T08:21:03Z'

const DATASET_PUBLICATION_DATE_STR = '2023-05-15'

const DATASET_HTML_DESCRIPTION =
  '<div><h1 class="test-class-to-ignore">Title 1</h1><p>Test paragraph 1</p><p>Test paragraph 2</p><p>Hello world</p><h2>Title 2</h2><h3>Title 3</h3></div>'

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export const createDatasetModel = (
  license?: DatasetLicense,
  addOptionalParameters = false
): Dataset => {
  const datasetModel: Dataset = {
    id: 1,
    persistentId: 'doi:10.5072/FK2/HC6KTB',
    versionId: 19,
    versionInfo: {
      majorNumber: 1,
      minorNumber: 0,
      state: DatasetVersionState.RELEASED,
      createTime: new Date(DATASET_CREATE_TIME_STR),
      lastUpdateTime: new Date(DATASET_UPDATE_TIME_STR),
      releaseTime: new Date(DATASET_RELEASE_TIME_STR)
    },
    publicationDate: DATASET_PUBLICATION_DATE_STR,
    metadataBlocks: [
      {
        name: 'citation',
        fields: {
          title: 'test',
          author: [
            {
              authorName: 'Admin, Dataverse',
              authorAffiliation: 'Dataverse.org'
            },
            {
              authorName: 'Owner, Dataverse',
              authorAffiliation: 'Dataverse.org'
            }
          ],
          subject: ['Subject1', 'Subject2'],
          dsDescription: [
            {
              dsDescriptionValue: turndownService.turndown(DATASET_HTML_DESCRIPTION)
            }
          ],
          datasetContact: [
            {
              datasetContactName: 'Admin, Dataverse',
              datasetContactEmail: 'someemail@test.com'
            }
          ]
        }
      }
    ],
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
  }
  if (license !== undefined) {
    datasetModel.license = license
  }
  if (addOptionalParameters) {
    datasetModel.alternativePersistentId = 'doi:10.5072/FK2/HC6KTB'
    datasetModel.publicationDate = '2021-01-01'
    datasetModel.citationDate = '2021-01-01'
  }
  return datasetModel
}

export const createDatasetVersionPayload = (
  license?: DatasetLicense,
  addOptionalProperties = false
): DatasetPayload => {
  const datasetPayload: DatasetPayload = {
    id: 19,
    datasetId: 1,
    datasetPersistentId: 'doi:10.5072/FK2/HC6KTB',
    versionNumber: 1,
    versionMinorNumber: 0,
    versionState: 'RELEASED',
    lastUpdateTime: DATASET_UPDATE_TIME_STR,
    releaseTime: DATASET_RELEASE_TIME_STR,
    createTime: DATASET_CREATE_TIME_STR,
    publicationDate: DATASET_PUBLICATION_DATE_STR,
    metadataBlocks: {
      citation: {
        name: 'citation',
        fields: [
          {
            typeName: 'title',
            multiple: false,
            typeClass: 'primitive',
            value: 'test'
          },
          {
            typeName: 'author',
            multiple: true,
            typeClass: 'compound',
            value: [
              {
                authorName: {
                  typeName: 'authorName',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Admin, Dataverse'
                },
                authorAffiliation: {
                  typeName: 'authorAffiliation',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Dataverse.org'
                }
              },
              {
                authorName: {
                  typeName: 'authorName',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Owner, Dataverse'
                },
                authorAffiliation: {
                  typeName: 'authorAffiliation',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Dataverse.org'
                }
              }
            ]
          },
          {
            typeName: 'subject',
            multiple: true,
            typeClass: 'controlledVocabulary',
            value: ['Subject1', 'Subject2']
          },
          {
            typeName: 'dsDescription',
            multiple: true,
            typeClass: 'compound',
            value: [
              {
                dsDescriptionValue: {
                  typeName: 'dsDescriptionValue',
                  multiple: false,
                  typeClass: 'primitive',
                  value: DATASET_HTML_DESCRIPTION
                }
              }
            ]
          },
          {
            typeName: 'datasetContact',
            multiple: true,
            typeClass: 'compound',
            value: [
              {
                datasetContactName: {
                  typeName: 'datasetContactName',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Admin, Dataverse'
                },
                datasetContactEmail: {
                  typeName: 'datasetContactEmail',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'someemail@test.com'
                }
              }
            ]
          }
        ]
      }
    },
    files: [],
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' }
  }
  if (license !== undefined) {
    datasetPayload.license = license
  }
  if (addOptionalProperties) {
    datasetPayload.alternativePersistentId = 'doi:10.5072/FK2/HC6KTB'
    datasetPayload.publicationDate = '2021-01-01'
    datasetPayload.citationDate = '2021-01-01'
  }
  return datasetPayload
}

export const createDatasetLicenseModel = (withIconUri = true): DatasetLicense => {
  const datasetLicense: DatasetLicense = {
    name: 'CC0 1.0',
    uri: 'https://creativecommons.org/publicdomain/zero/1.0/'
  }
  if (withIconUri) {
    datasetLicense.iconUri = 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  }
  return datasetLicense
}

export const publishDatasetViaApi = async (datasetId: number): Promise<AxiosResponse> => {
  return await axios.post(
    `${TestConstants.TEST_API_URL}/datasets/${datasetId}/actions/:publish?type=major`,
    {},
    DATAVERSE_API_REQUEST_HEADERS
  )
}

export const deaccessionDatasetViaApi = async (
  datasetId: number,
  versionId: string
): Promise<AxiosResponse> => {
  const data = { deaccessionReason: 'Test reason.' }
  return await axios.post(
    `${TestConstants.TEST_API_URL}/datasets/${datasetId}/versions/${versionId}/deaccession`,
    JSON.stringify(data),
    DATAVERSE_API_REQUEST_HEADERS
  )
}

export const createPrivateUrlViaApi = async (datasetId: number): Promise<AxiosResponse> => {
  return await axios.post(
    `${TestConstants.TEST_API_URL}/datasets/${datasetId}/privateUrl`,
    {},
    DATAVERSE_API_REQUEST_HEADERS
  )
}

export const waitForNoLocks = async (
  datasetId: number,
  maxRetries = 20,
  delay = 1000
): Promise<void> => {
  let hasLocks = true
  let retry = 0
  while (hasLocks && retry < maxRetries) {
    await axios
      .get(`${TestConstants.TEST_API_URL}/datasets/${datasetId}/locks`)
      .then((response) => {
        const nLocks = response.data.data.length
        if (nLocks == 0) {
          hasLocks = false
        }
      })
      .catch((error) => {
        console.log(
          `Error while waiting for no dataset locks: [${error.response.status}]${
            error.response.data ? ` ${error.response.data.message}` : ''
          }`
        )
      })
    await new Promise((resolve) => setTimeout(resolve, delay))
    retry++
  }
  if (hasLocks) {
    throw new Error('Max retries reached.')
  }
}
