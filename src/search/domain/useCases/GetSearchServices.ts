import { UseCase } from '../../../core/domain/useCases/UseCase'
import { SearchService } from '../models/SearchService'
import { ISearchServicesRepository } from '../repositories/ISearchServicesRepository'

export class GetSearchServices implements UseCase<SearchService[]> {
  private searchServicesRepository: ISearchServicesRepository

  constructor(searchServicesRepository: ISearchServicesRepository) {
    this.searchServicesRepository = searchServicesRepository
  }

  /**
   * Returns all search services available in the installation.
   *
   * @returns {Promise<SearchService[]>}
   */
  async execute(): Promise<SearchService[]> {
    return await this.searchServicesRepository.getSearchServices()
  }
}
