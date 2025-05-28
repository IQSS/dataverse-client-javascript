import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { SearchService } from '../../domain/models/SearchService'
import { ISearchServicesRepository } from '../../domain/repositories/ISearchServicesRepository'

export class SearchServicesRepository extends ApiRepository implements ISearchServicesRepository {
  public async getSearchServices(): Promise<SearchService[]> {
    throw new Error('Method not implemented.')
  }
}
