import { SearchService } from '../models/SearchService'

export interface ISearchServicesRepository {
  getSearchServices(): Promise<SearchService[]>
}
