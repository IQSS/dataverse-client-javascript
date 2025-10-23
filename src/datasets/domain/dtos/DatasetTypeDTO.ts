import { DatasetType } from '../models/DatasetType'

export type DatasetTypeDTO = Omit<DatasetType, 'id'>
