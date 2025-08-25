import { AxiosResponse } from 'axios'
import { DatasetExternalToolUrl } from '../../domain/models/ExternalTool'

export const datasetExternalToolTransformer = (
  response: AxiosResponse<{
    data: { toolUrl: string; displayName: string; datasetId: number; preview: boolean }
  }>
): DatasetExternalToolUrl => {
  const datasetExtTool = response.data.data

  return {
    toolUrlResolved: datasetExtTool.toolUrl,
    displayName: datasetExtTool.displayName,
    datasetId: datasetExtTool.datasetId,
    preview: datasetExtTool.preview
  }
}
