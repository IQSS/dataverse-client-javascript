import { GetSearchServices } from './domain/useCases/GetSearchServices'
import { SearchServicesRepository } from './infra/repositories/SearchServicesRepository'

const searchServicesRepository = new SearchServicesRepository()

const getSearchServices = new GetSearchServices(searchServicesRepository)

export { getSearchServices }

export { SearchService } from './domain/models/SearchService'
