import axios from 'axios'
import { TestConstants } from '../TestConstants'
import { DatasetTemplatePayload } from '../../../src/template/infra/repositories/transformers/DatasetTemplatePayload'

const DATASET_TEMPLATE_DTO = {
  name: 'Dataset Template',
  isDefault: true,
  fields: [
    {
      typeName: 'author',
      value: [
        {
          authorName: {
            typeName: 'authorName',
            value: 'Belicheck, Bill'
          },
          authorAffiliation: {
            typeName: 'authorIdentifierScheme',
            value: 'ORCID'
          }
        }
      ]
    }
  ],
  instructions: [
    {
      instructionField: 'author',
      instructionText: 'The author data'
    }
  ]
}

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export async function createDatasetTemplateViaApi(
  collectionAlias: string
): Promise<DatasetTemplatePayload> {
  try {
    if (collectionAlias == undefined) {
      collectionAlias = ':root'
    }
    return await axios
      .post(
        `${TestConstants.TEST_API_URL}/dataverses/${collectionAlias}/templates`,
        JSON.stringify(DATASET_TEMPLATE_DTO),
        DATAVERSE_API_REQUEST_HEADERS
      )
      .then((response) => response.data.data)
  } catch (error) {
    throw new Error(`Error while creating dataset template in collection ${collectionAlias}`)
  }
}

export async function deleteDatasetTemplateViaApi(templateId: number): Promise<void> {
  try {
    return await axios
      .delete(
        `${TestConstants.TEST_API_URL}/admin/template/${templateId}`,
        DATAVERSE_API_REQUEST_HEADERS
      )
      .then((response) => response.data.data)
  } catch (error) {
    throw new Error(`Error while deleting dataset template with id ${templateId}`)
  }
}
