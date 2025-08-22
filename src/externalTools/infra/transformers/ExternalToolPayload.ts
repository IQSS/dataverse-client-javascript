export interface ExternalToolPayload {
  id: number
  displayName: string
  description: string
  types: ToolTypePayload[]
  scope: ToolScopePayload
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
