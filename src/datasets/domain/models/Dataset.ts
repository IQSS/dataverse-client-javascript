export interface Dataset {
  id: number;
  persistentId: string;
  versionId: number;
  versionInfo: DatasetVersionInfo;
  license: DatasetLicense;
  metadataBlocks: DatasetMetadataBlock[];
}

export interface DatasetVersionInfo {
  majorNumber: number;
  minorNumber: number;
  state: DatasetVersionState;
  createTime: Date;
  lastUpdateTime: Date;
  releaseTime?: Date;
}

export enum DatasetVersionState {
  DRAFT = 'DRAFT',
  RELEASED = 'RELEASED',
  ARCHIVED = 'ARCHIVED',
  DEACCESSIONED = 'DEACCESSIONED',
}

export interface DatasetLicense {
  name: string;
  uri: string;
}

export interface DatasetMetadataBlock {
  name: string;
  fields: DatasetMetadataFields;
}

export type DatasetMetadataFields = Record<string, DatasetMetadataFieldValue>;

export type DatasetMetadataFieldValue = string | string[] | DatasetMetadataSubField | DatasetMetadataSubField[];

export type DatasetMetadataSubField = Record<string, string>;
