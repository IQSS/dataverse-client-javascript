export interface DvObjectOwnerNode {
  type: DvObjectType
  displayName: string
  identifier: string
  persistentIdentifier?: string
  version?: string
  isPartOf?: DvObjectOwnerNode
}

export enum DvObjectType {
  DATAVERSE = 'DATAVERSE',
  DATASET = 'DATASET',
  FILE = 'FILE'
}
