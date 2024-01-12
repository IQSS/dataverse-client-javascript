export interface NewDataset {
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
  | NewDatasetMetadataSubFieldValue
  | NewDatasetMetadataSubFieldValue[];

export type NewDatasetMetadataSubFieldValue = Record<string, string>;
