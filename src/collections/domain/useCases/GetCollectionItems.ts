import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CollectionSearchCriteria } from '../../../collections'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class GetCollectionItems implements UseCase<CollectionItemSubset> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns an instance of CollectionItemSubset that contains reduced information for each item that the calling user can access in the installation.
   * If the collectionId parameter is not set, the use case will return items starting from the root collection.
   *
   * @param {string} [collectionId] - Collection id (optional).
   * @param {number} [limit] - Limit for pagination (optional).
   * @param {number} [offset] - Offset for pagination (optional).
   * @param {CollectionSearchCriteria} [collectionSearchCriteria] - Supports filtering the collection items by different properties (optional).
   * @returns {Promise<CollectionItemSubset>}
   */
  async execute(
    collectionId?: string,
    limit?: number,
    offset?: number,
    collectionSearchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    return await this.collectionsRepository.getCollectionItems(
      collectionId,
      limit,
      offset,
      collectionSearchCriteria
    )
  }
}
