import { AxiosResponse } from 'axios'
import { ExternalTool } from '../../domain/models/ExternalTool'
import { ExternalToolPayload } from './ExternalToolPayload'

export const externalToolsTransformer = (
  response: AxiosResponse<{
    data: ExternalToolPayload[]
  }>
): ExternalTool[] => {
  const tools = response.data.data

  return tools.map((tool) => ({
    id: tool.id,
    displayName: tool.displayName,
    description: tool.description,
    types: tool.types,
    scope: tool.scope,
    contentType: tool.contentType,
    toolParameters: tool.toolParameters,
    allowedApiCalls: tool.allowedApiCalls,
    requirements: tool.requirements
  }))
}
