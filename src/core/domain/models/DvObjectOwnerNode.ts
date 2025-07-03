export interface DvObjectOwnerNode {
  type: DvObjectType
  displayName: string
  identifier: string
  persistentIdentifier?: string
  version?: string
  isReleased?: boolean
  isPartOf?: DvObjectOwnerNode
}

export enum DvObjectType {
  DATAVERSE = 'DATAVERSE',
  DATASET = 'DATASET',
  FILE = 'FILE'
}
