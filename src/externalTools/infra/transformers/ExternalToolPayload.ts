export interface ExternalToolPayload {
  id: number
  displayName: string
  description: string
  types: ToolTypePayload[]
  scope: ToolScopePayload
  contentType?: string // Only present when scope is 'file'
}

enum ToolTypePayload {
  Explore = 'explore',
  Configure = 'configure',
  Preview = 'preview',
  Query = 'query'
}

enum ToolScopePayload {
  Dataset = 'dataset',
  File = 'file'
}
