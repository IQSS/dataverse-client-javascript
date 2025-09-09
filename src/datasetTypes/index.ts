import { DatasetTypesRepository } from './infra/repositories/DatasetTypesRepository'
import { GetAvailableDatasetTypes } from './domain/useCases/GetAvailableDatasetTypes'

const datasetTypesRepository = new DatasetTypesRepository()

const getAvailableDatasetTypes = new GetAvailableDatasetTypes(datasetTypesRepository)

export { getAvailableDatasetTypes }

export { DatasetType } from './domain/models/DatasetType'
