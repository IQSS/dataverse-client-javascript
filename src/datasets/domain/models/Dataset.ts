export interface Dataset {
  id: number;
  persistentId: string;
  versionId: number;
  versionInfo: DatasetVersionInfo;
  license?: DatasetLicense;
  metadataBlocks: MetadataBlocks;
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
  iconUri?: string;
}

export type MetadataBlocks = [CitationMetadataBlock, ...DatasetMetadataBlock[]];

export interface DatasetMetadataBlock {
  name: string;
  fields: DatasetMetadataFields;
}

export interface CitationMetadataBlock extends DatasetMetadataBlock {
  name: 'citation';
  fields: {
    title: string;
    author: DatasetAuthor[];
    datasetContact: DatasetContact[];
    dsDescription: DatasetDescription[];
    subject: string[];
    depositor?: string;
    dateOfDeposit?: string;
  };
}

export interface DatasetAuthor extends DatasetMetadataSubField {
  authorName: string;
  authorAffiliation: string;
  authorIdentifierScheme?: string;
  authorIdentifier?: string;
}

export interface DatasetContact extends DatasetMetadataSubField {
  datasetContactName: string;
  datasetContactEmail: string;
  datasetContactAffiliation?: string;
}

export interface DatasetDescription extends DatasetMetadataSubField {
  dsDescriptionValue: string;
}

export type DatasetMetadataFields = Record<string, DatasetMetadataFieldValue>;

export type DatasetMetadataFieldValue = string | string[] | DatasetMetadataSubField | DatasetMetadataSubField[];

export type DatasetMetadataSubField = Record<string, string>;
