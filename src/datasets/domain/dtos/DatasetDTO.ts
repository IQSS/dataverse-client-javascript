import { DatasetLicense } from '../models/Dataset'

export interface DatasetDTO {
  license?: DatasetLicense
  metadataBlockValues: DatasetMetadataBlockValuesDTO[]
}

export interface DatasetMetadataBlockValuesDTO {
  name: string
  fields: DatasetMetadataFieldsDTO
}

export type DatasetMetadataFieldsDTO = Record<string, DatasetMetadataFieldValueDTO>

export type DatasetMetadataFieldValueDTO =
  | string
  | string[]
  | DatasetMetadataChildFieldValueDTO
  | DatasetMetadataChildFieldValueDTO[]

export type DatasetMetadataChildFieldValueDTO = Record<string, string>
