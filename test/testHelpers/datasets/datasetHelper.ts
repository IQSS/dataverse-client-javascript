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
import {
  DatasetDTO,
  DatasetMetadataFieldValueDTO
} from '../../../src/datasets/domain/dtos/DatasetDTO'
import { MetadataBlock, MetadataFieldType } from '../../../src'
import {
  NewDatasetRequestPayload,
  UpdateDatasetRequestPayload
} from '../../../src/datasets/infra/repositories/transformers/datasetTransformers'
import {
  MetadataFieldWatermark,
  MetadataFieldTypeClass
} from '../../../src/metadataBlocks/domain/models/MetadataBlock'

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

export const deleteUnpublishedDatasetViaApi = async (datasetId: number): Promise<AxiosResponse> => {
  try {
    return await axios.delete(
      `${TestConstants.TEST_API_URL}/datasets/${datasetId}`,
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    throw new Error(`Error while deleting unpublished test dataset ${datasetId}`)
  }
}

export const deletePublishedDatasetViaApi = async (
  datasetPersistentId: string
): Promise<AxiosResponse> => {
  try {
    return await axios.delete(
      `${TestConstants.TEST_API_URL}/datasets/:persistentId/destroy?persistentId=${datasetPersistentId}`,
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    throw new Error(`Error while deleting published test dataset ${datasetPersistentId}`)
  }
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
  try {
    return await axios.post(
      `${TestConstants.TEST_API_URL}/datasets/${datasetId}/actions/:publish?type=major`,
      {},
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    throw new Error(`Error while publishing test dataset ${datasetId}`)
  }
}

export const deaccessionDatasetViaApi = async (
  datasetId: number,
  versionId: string
): Promise<AxiosResponse> => {
  try {
    const data = { deaccessionReason: 'Test reason.' }
    return await axios.post(
      `${TestConstants.TEST_API_URL}/datasets/${datasetId}/versions/${versionId}/deaccession`,
      JSON.stringify(data),
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    throw new Error(`Error while deaccessioning test dataset ${datasetId}`)
  }
}

export const createPrivateUrlViaApi = async (datasetId: number): Promise<AxiosResponse> => {
  try {
    return await axios.post(
      `${TestConstants.TEST_API_URL}/datasets/${datasetId}/privateUrl`,
      {},
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    throw new Error(`Error while creating private URL for dataset ${datasetId}`)
  }
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

export async function waitForDatasetsIndexedInSolr(
  expectedNumberOfIndexedDatasets: number,
  collectionAlias: string
): Promise<void> {
  let datasetsIndexed = false
  let retry = 0
  while (!datasetsIndexed && retry < 10) {
    await axios
      .get(
        `${TestConstants.TEST_API_URL}/search?q=*&type=dataset&subtree=${collectionAlias}`,
        DATAVERSE_API_REQUEST_HEADERS
      )
      .then((response) => {
        const nDatasets = response.data.data.items.length
        if (nDatasets === expectedNumberOfIndexedDatasets) {
          datasetsIndexed = true
        }
      })
      .catch((error) => {
        console.error(
          `Error while waiting for datasets indexing in Solr: [${error.response.status}]${
            error.response.data ? ` ${error.response.data.message}` : ''
          }`
        )
      })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    retry++
  }
  if (!datasetsIndexed) {
    throw new Error('Timeout reached while waiting for datasets indexing in Solr')
  }
}

export const createDatasetDTO = (
  titleFieldValue?: DatasetMetadataFieldValueDTO,
  authorFieldValue?: DatasetMetadataFieldValueDTO,
  alternativeRequiredTitleValue?: DatasetMetadataFieldValueDTO,
  timePeriodCoveredStartValue?: DatasetMetadataFieldValueDTO,
  contributorTypeValue?: DatasetMetadataFieldValueDTO,
  license?: DatasetLicense,
  dateOfCreationValue?: DatasetMetadataFieldValueDTO
): DatasetDTO => {
  const validTitle = 'test dataset'
  const validAuthorFieldValue = [
    {
      authorName: 'Admin, Dataverse',
      authorAffiliation: 'Dataverse.org'
    },
    {
      authorName: 'Owner, Dataverse',
      authorAffiliation: 'Dataverse.org'
    }
  ]
  const validAlternativeRequiredTitleValue = ['alternative1', 'alternative2']
  return {
    ...(license && { license }),
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: titleFieldValue !== undefined ? titleFieldValue : validTitle,
          author: authorFieldValue !== undefined ? authorFieldValue : validAuthorFieldValue,
          alternativeRequiredTitle:
            alternativeRequiredTitleValue !== undefined
              ? alternativeRequiredTitleValue
              : validAlternativeRequiredTitleValue,
          ...(timePeriodCoveredStartValue && {
            timePeriodCoveredStart: timePeriodCoveredStartValue
          }),
          ...(dateOfCreationValue && {
            dateOfCreation: dateOfCreationValue
          }),
          ...(contributorTypeValue && {
            contributor: [
              {
                contributorName: 'Admin, Dataverse',
                contributorType: contributorTypeValue as string
              }
            ]
          })
        }
      }
    ]
  }
}

export const createDatasetDTOWithoutFirstLevelRequiredField = (): DatasetDTO => {
  return {
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'test dataset'
        }
      }
    ]
  }
}

export const createDatasetDTOWithoutSecondLevelRequiredField = (): DatasetDTO => {
  return {
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'test dataset',
          author: [
            {
              authorName: 'Admin, Dataverse',
              authorAffiliation: 'Dataverse.org'
            },
            {
              authorAffiliation: 'Dataverse.org'
            }
          ]
        }
      }
    ]
  }
}

/**
 *
 * This method creates a simplified and altered version of the Citation Metadata Block, only for testing purposes.
 * For this reason some of the metadata fields do not correspond to the real ones.
 *
 * @returns {MetadataBlock} A MetadataBlock testing instance.
 *
 **/
export const createDatasetMetadataBlockModel = (): MetadataBlock => {
  return {
    id: 1,
    name: 'citation',
    displayName: 'Citation Metadata',
    displayOnCreate: true,
    metadataFields: {
      title: {
        name: 'title',
        displayName: 'title',
        title: 'title',
        type: MetadataFieldType.Text,
        watermark: MetadataFieldWatermark.Empty,
        description: 'description',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 0,
        displayOnCreate: true,
        typeClass: MetadataFieldTypeClass.Primitive
      },
      author: {
        name: 'author',
        displayName: 'author',
        title: 'author',
        type: MetadataFieldType.None,
        watermark: MetadataFieldWatermark.Empty,
        description: 'description',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 1,
        typeClass: MetadataFieldTypeClass.Compound,
        displayOnCreate: true,
        childMetadataFields: {
          authorName: {
            name: 'authorName',
            displayName: 'author name',
            title: 'author name',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'description',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 2,
            displayOnCreate: true,
            typeClass: MetadataFieldTypeClass.Primitive
          },
          authorAffiliation: {
            name: 'authorAffiliation',
            displayName: 'author affiliation',
            title: 'author affiliation',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'descriprion',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: false,
            displayOrder: 3,
            displayOnCreate: true,
            typeClass: MetadataFieldTypeClass.Primitive
          }
        }
      },
      alternativeRequiredTitle: {
        name: 'alternativeRequiredTitle',
        displayName: 'Alternative Required Title',
        title: 'Alternative Title',
        type: MetadataFieldType.Text,
        watermark: MetadataFieldWatermark.Empty,
        description:
          'Either 1) a title commonly used to refer to the Dataset or 2) an abbreviation of the main title',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 4,
        displayOnCreate: true,
        typeClass: MetadataFieldTypeClass.Primitive
      },
      timePeriodCoveredStart: {
        name: 'timePeriodCoveredStart',
        displayName: 'Time Period Start Date',
        title: 'Start Date',
        type: MetadataFieldType.Date,
        watermark: MetadataFieldWatermark.YYYYOrYYYYMMOrYYYYMMDD,
        description: 'The start date of the time period that the data refer to',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#NAME: #VALUE ',
        isRequired: false,
        displayOrder: 5,
        displayOnCreate: true,
        typeClass: MetadataFieldTypeClass.Primitive
      },
      dateOfCreation: {
        name: 'dateOfCreation',
        displayName: 'Date of Creation',
        title: 'Creation Date',
        type: MetadataFieldType.Date,
        watermark: MetadataFieldWatermark.YyyyMmDD,
        description: 'The creation date of dataset',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#NAME: #VALUE ',
        isRequired: false,
        displayOrder: 5,
        displayOnCreate: true,
        typeClass: MetadataFieldTypeClass.Primitive
      },
      contributor: {
        name: 'contributor',
        displayName: 'Contributor',
        title: 'Contributor',
        type: MetadataFieldType.None,
        watermark: MetadataFieldWatermark.Empty,
        description:
          'The entity, such as a person or organization, responsible for collecting, managing, or otherwise contributing to the development of the Dataset',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: ':',
        isRequired: false,
        displayOrder: 6,
        typeClass: MetadataFieldTypeClass.Compound,
        displayOnCreate: true,
        childMetadataFields: {
          contributorType: {
            name: 'contributorType',
            displayName: 'Contributor Type',
            title: 'Type',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'Indicates the type of contribution made to the dataset',
            multiple: false,
            isControlledVocabulary: true,
            displayFormat: '#VALUE ',
            isRequired: false,
            displayOrder: 7,
            displayOnCreate: true,
            controlledVocabularyValues: [
              'Data Collector',
              'Data Curator',
              'Data Manager',
              'Editor',
              'Funder',
              'Hosting Institution',
              'Project Leader',
              'Project Manager',
              'Project Member',
              'Related Person',
              'Researcher',
              'Research Group',
              'Rights Holder',
              'Sponsor',
              'Supervisor',
              'Work Package Leader',
              'Other'
            ],
            typeClass: MetadataFieldTypeClass.ControlledVocabulary
          },
          contributorName: {
            name: 'contributorName',
            displayName: 'Contributor Name',
            title: 'Name',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description:
              "The name of the contributor, e.g. the person's name or the name of an organization",
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 8,
            typeClass: MetadataFieldTypeClass.Primitive,
            displayOnCreate: true
          }
        }
      }
    }
  }
}

export const createNewDatasetRequestPayload = (
  license?: DatasetLicense
): NewDatasetRequestPayload => {
  return {
    datasetVersion: {
      ...(license && { license }),
      metadataBlocks: {
        citation: {
          fields: [
            {
              value: 'test dataset',
              typeClass: 'primitive',
              multiple: false,
              typeName: 'title'
            },
            {
              value: [
                {
                  authorName: {
                    value: 'Admin, Dataverse',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorName'
                  },
                  authorAffiliation: {
                    value: 'Dataverse.org',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorAffiliation'
                  }
                },
                {
                  authorName: {
                    value: 'Owner, Dataverse',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorName'
                  },
                  authorAffiliation: {
                    value: 'Dataverse.org',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorAffiliation'
                  }
                }
              ],
              typeClass: 'compound',
              multiple: true,
              typeName: 'author'
            },
            {
              value: ['alternative1', 'alternative2'],
              typeClass: 'primitive',
              multiple: true,
              typeName: 'alternativeRequiredTitle'
            }
          ],
          displayName: 'Citation Metadata'
        }
      }
    }
  }
}

export const createUpdateDatasetRequestPayload = (): UpdateDatasetRequestPayload => {
  return {
    fields: [
      {
        value: 'test dataset',
        typeClass: 'primitive',
        multiple: false,
        typeName: 'title'
      },
      {
        value: [
          {
            authorName: {
              value: 'Admin, Dataverse',
              typeClass: 'primitive',
              multiple: false,
              typeName: 'authorName'
            },
            authorAffiliation: {
              value: 'Dataverse.org',
              typeClass: 'primitive',
              multiple: false,
              typeName: 'authorAffiliation'
            }
          },
          {
            authorName: {
              value: 'Owner, Dataverse',
              typeClass: 'primitive',
              multiple: false,
              typeName: 'authorName'
            },
            authorAffiliation: {
              value: 'Dataverse.org',
              typeClass: 'primitive',
              multiple: false,
              typeName: 'authorAffiliation'
            }
          }
        ],
        typeClass: 'compound',
        multiple: true,
        typeName: 'author'
      },
      {
        value: ['alternative1', 'alternative2'],
        typeClass: 'primitive',
        multiple: true,
        typeName: 'alternativeRequiredTitle'
      }
    ]
  }
}
