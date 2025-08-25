import { AxiosResponse } from 'axios'
import { DatasetExternalToolResolved } from '../../domain/models/ExternalTool'

export const datasetExternalToolTransformer = (
  response: AxiosResponse<{
    data: { toolUrl: string; displayName: string; datasetId: number; preview: boolean }
  }>
): DatasetExternalToolResolved => {
  const datasetExtTool = response.data.data

  return {
    toolUrlResolved: datasetExtTool.toolUrl,
    displayName: datasetExtTool.displayName,
    datasetId: datasetExtTool.datasetId,
    preview: datasetExtTool.preview
  }
}
