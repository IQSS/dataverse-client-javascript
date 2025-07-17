export interface DatasetLinkedCollectionsPayload {
  id: number
  identifier: string
  'linked-dataverses': {
    id: number
    alias: string
    displayName: string
  }[]
}
