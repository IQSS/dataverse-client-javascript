import { ToolScope, ToolType } from '../../domain/models/ExternalTool'

export interface ExternalToolPayload {
  id: number
  displayName: string
  description: string
  types: ToolType[]
  scope: ToolScope
  contentType?: string // Only present when scope is 'file'
}
