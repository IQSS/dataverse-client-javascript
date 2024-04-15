export interface MetadataBlockPayload {
  id: number
  name: string
  displayName: string
  displayOnCreate: boolean
  fields: Record<string, unknown>
}
