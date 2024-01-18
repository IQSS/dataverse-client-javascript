import { DatasetLicense } from './Dataset';

export interface NewDataset {
  license?: DatasetLicense;
  metadataBlockValues: NewDatasetMetadataBlockValues[];
}

export interface NewDatasetMetadataBlockValues {
  name: string;
  fields: NewDatasetMetadataFields;
}

export type NewDatasetMetadataFields = Record<string, NewDatasetMetadataFieldValue>;

export type NewDatasetMetadataFieldValue =
  | string
  | string[]
  | NewDatasetMetadataChildFieldValue
  | NewDatasetMetadataChildFieldValue[];

export type NewDatasetMetadataChildFieldValue = Record<string, string>;
