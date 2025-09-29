import axios, { AxiosResponse } from 'axios'
import {
  DatasetExternalToolResolved,
  ExternalTool,
  FileExternalToolResolved,
  ToolScope,
  ToolType
} from '../../../src'
import { TestConstants } from '../TestConstants'
import { ExternalToolPayload } from '../../../src/externalTools/infra/transformers/ExternalToolPayload'

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export const CREATE_FILE_EXTERNAL_TOOL_PAYLOAD: ISetExternalToolViaApi = {
  displayName: 'Text File Tool',
  toolName: 'textFileTool',
  description: 'Text File Tool',
  types: [ToolType.Preview],
  scope: ToolScope.File,
  toolUrl: 'http://example.org/text-tool',
  toolParameters: {
    queryParameters: [
      { fileid: '{fileId}' },
      { siteUrl: '{siteUrl}' },
      { datasetid: '{datasetId}' },
      { datasetversion: '{datasetVersion}' },
      { locale: '{localeCode}' }
    ]
  },
  contentType: 'text/plain',
  allowedApiCalls: [
    {
      name: 'retrieveFileContents',
      httpMethod: 'GET',
      urlTemplate: '/api/v1/access/datafile/{fileId}',
      timeOut: 3600
    }
  ]
}

export const CREATE_DATASET_EXTERNAL_TOOL_PAYLOAD: ISetExternalToolViaApi = {
  displayName: 'Dataset Tool',
  toolName: 'datasetFileTool',
  description: 'Dataset Explore Tool',
  types: [ToolType.Explore],
  scope: ToolScope.Dataset,
  toolUrl: 'http://example.org/dataset-tool',
  toolParameters: {
    queryParameters: [{ datasetPid: '{datasetPid}' }]
  }
}

export const createExternalToolsModel = (): ExternalTool[] => {
  return [
    {
      id: 1,
      displayName: 'Test External Tool 1',
      description: 'Description for Test External Tool 1',
      scope: ToolScope.Dataset,
      types: [ToolType.Explore]
    },
    {
      id: 2,
      displayName: 'Test External Tool 2',
      description: 'Description for Test External Tool 2',
      scope: ToolScope.File,
      types: [ToolType.Preview]
    }
  ]
}

export const createFileExternalToolResolvedModel = (): FileExternalToolResolved => {
  return {
    toolUrlResolved: 'https://example.com/text-tool?fileId=123',
    displayName: 'Test File External Tool',
    fileId: 123,
    preview: true
  }
}

export const createDatasetExternalToolResolvedModel = (): DatasetExternalToolResolved => {
  return {
    toolUrlResolved: 'https://example.com/dataset-tool?datasetId=456',
    displayName: 'Test Dataset External Tool',
    datasetId: 456,
    preview: false
  }
}

interface ISetExternalToolViaApi {
  displayName: string
  toolName: string
  description: string
  types: ToolType[]
  scope: ToolScope
  toolUrl: string
  toolParameters: {
    queryParameters: { [key: string]: string }[]
  }
  contentType?: string
  allowedApiCalls?: {
    name: string
    httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
    urlTemplate: string
    timeOut: number
  }[]
}

export async function createExternalToolViaApi(
  type: 'dataset' | 'file'
): Promise<AxiosResponse<{ data: ExternalToolPayload }>> {
  try {
    return await axios.post(
      `${TestConstants.TEST_API_URL}/admin/externalTools`,
      type === 'dataset' ? CREATE_DATASET_EXTERNAL_TOOL_PAYLOAD : CREATE_FILE_EXTERNAL_TOOL_PAYLOAD,
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    console.log(error)
    throw new Error('Error while setting external tool via API.')
  }
}

export async function deleteExternalToolViaApi(toolId: number): Promise<void> {
  try {
    await axios.delete(
      `${TestConstants.TEST_API_URL}/externalTools/${toolId}`,
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    console.log(error)
    throw new Error('Error while deleting external tool via API.')
  }
}
