export interface DvObjectOwner {
  type: DvObjectType;
  identifier: string;
  displayName: string;
  owner?: DvObjectOwner;
}

export enum DvObjectType {
  DATAVERSE = 'DATAVERSE',
  DATASET = 'DATASET',
  FILE = 'FILE',
}
