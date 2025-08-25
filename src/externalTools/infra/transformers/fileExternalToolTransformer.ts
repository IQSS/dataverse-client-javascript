import { AxiosResponse } from 'axios'
import { FileExternalToolUrl } from '../../domain/models/ExternalTool'

export const fileExternalToolTransformer = (
  response: AxiosResponse<{
    data: { toolUrl: string; displayName: string; fileId: number; preview: boolean }
  }>
): FileExternalToolUrl => {
  const fileExtTool = response.data.data

  return {
    toolUrlResolved: fileExtTool.toolUrl,
    displayName: fileExtTool.displayName,
    fileId: fileExtTool.fileId,
    preview: fileExtTool.preview
  }
}
