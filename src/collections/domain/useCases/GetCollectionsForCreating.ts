import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { CollectionSummary } from '../models/CollectionSummary'

export class GetCollectionsForCreating implements UseCase<CollectionSummary[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns an array of CollectionSummary (id, alias, displayName) of the collections an authenticated user can create a Dataset in.
   * @param userIdentifier - May be used by a superuser to get the collections for a specific user.
   */
  async execute(
    userIdentifier?: string
  ): Promise<CollectionSummary[]> {
    return await this.collectionsRepository.getCollectionsForCreating(userIdentifier)
  }
}
