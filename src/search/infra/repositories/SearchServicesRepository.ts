import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { SearchService } from '../../domain/models/SearchService'
import { ISearchServicesRepository } from '../../domain/repositories/ISearchServicesRepository'
import { transformSearchServicesResponseToSearchServices } from './transformers/searchServiceTransformers'

export class SearchServicesRepository extends ApiRepository implements ISearchServicesRepository {
  public async getSearchServices(): Promise<SearchService[]> {
    return this.doGet(`/searchServices/`)
      .then((response) => transformSearchServicesResponseToSearchServices(response))
      .catch((error) => {
        throw error
      })
  }
}
