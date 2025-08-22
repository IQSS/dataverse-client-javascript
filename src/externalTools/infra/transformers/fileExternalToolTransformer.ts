import { AxiosResponse } from 'axios'
import { FileExternalToolUrl } from '../../domain/models/ExternalTool'

export const fileExternalToolTransformer = (
  response: AxiosResponse<{
    data: { toolUrl: string; toolName: string; fileId: number; preview: boolean }
  }>
): FileExternalToolUrl => {
  const fileExtTool = response.data.data

  return {
    toolUrlResolved: fileExtTool.toolUrl,
    displayName: fileExtTool.toolName, // TODO:ME - Maybe the API changes to displayName, keep an eye on it
    fileId: fileExtTool.fileId,
    preview: fileExtTool.preview
  }
}
