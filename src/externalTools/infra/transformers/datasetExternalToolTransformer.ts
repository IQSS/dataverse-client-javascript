import { AxiosResponse } from 'axios'
import { DatasetExternalToolUrl } from '../../domain/models/ExternalTool'

export const datasetExternalToolTransformer = (
  response: AxiosResponse<{
    data: { toolUrl: string; toolName: string; datasetId: number; preview: boolean }
  }>
): DatasetExternalToolUrl => {
  const datasetExtTool = response.data.data

  return {
    toolUrlResolved: datasetExtTool.toolUrl,
    displayName: datasetExtTool.toolName, // TODO:ME - Maybe the API changes to displayName, keep an eye on it
    datasetId: datasetExtTool.datasetId,
    preview: datasetExtTool.preview
  }
}
