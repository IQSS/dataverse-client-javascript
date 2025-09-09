import { DatasetType } from '../models/DatasetType'

export interface IDatasetTypesRepository {
  getAvailableDatasetTypes(): Promise<DatasetType[]>
}
