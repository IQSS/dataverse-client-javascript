export interface OwnerNodePayload {
  type: string
  displayName: string
  identifier: string
  persistentIdentifier?: string
  version?: string
  isReleased?: boolean
  isPartOf?: OwnerNodePayload
}
