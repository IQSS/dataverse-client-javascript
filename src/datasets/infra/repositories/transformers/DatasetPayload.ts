import { FilePayload } from '../../../../files/infra/repositories/transformers/FilePayload';
import { OwnerPayload } from '../../../../dv-object/infra/repositories/transformers/OwnerPayload';

export interface DatasetPayload {
  datasetId: number;
  datasetPersistentId: string;
  id: number;
  versionNumber: number;
  versionMinorNumber: number;
  versionState: string;
  createTime: string;
  lastUpdateTime: string;
  releaseTime: string;
  metadataBlocks: MetadataBlocksPayload;
  license?: LicensePayload;
  alternativePersistentId?: string;
  publicationDate?: string;
  citationDate?: string;
  files: FilePayload[];
  owner: OwnerPayload;
}

export interface LicensePayload {
  name: string;
  uri: string;
  iconUri?: string;
}

export interface MetadataBlocksPayload {
  [blockName: string]: MetadataBlockPayload;
}

export interface MetadataBlockPayload {
  name: string;
  fields: MetadataFieldPayload[];
}

export interface MetadataFieldPayload {
  typeName: string;
  value: MetadataFieldValuePayload;
  typeClass: string;
  multiple: boolean;
}

export type MetadataFieldValuePayload =
  | string
  | string[]
  | MetadataSubfieldValuePayload
  | MetadataSubfieldValuePayload[];

export interface MetadataSubfieldValuePayload {
  [key: string]: { value: string; typeName: string; multiple: boolean; typeClass: string };
}
