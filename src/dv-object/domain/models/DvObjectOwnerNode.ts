export interface DvObjectOwnerNode {
  type: DvObjectType;
  identifier: string;
  displayName: string;
  isPartOf?: DvObjectOwnerNode;
}

export enum DvObjectType {
  DATAVERSE = 'DATAVERSE',
  DATASET = 'DATASET',
  FILE = 'FILE',
}
