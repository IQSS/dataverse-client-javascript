import { DatasetLicense } from '../models/Dataset';

export interface NewDatasetDTO {
  license?: DatasetLicense;
  metadataBlockValues: NewDatasetMetadataBlockValuesDTO[];
}

export interface NewDatasetMetadataBlockValuesDTO {
  name: string;
  fields: NewDatasetMetadataFieldsDTO;
}

export type NewDatasetMetadataFieldsDTO = Record<string, NewDatasetMetadataFieldValueDTO>;

export type NewDatasetMetadataFieldValueDTO =
  | string
  | string[]
  | NewDatasetMetadataChildFieldValueDTO
  | NewDatasetMetadataChildFieldValueDTO[];

export type NewDatasetMetadataChildFieldValueDTO = Record<string, string>;
