import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class GetCollectionItems implements UseCase<CollectionItemSubset> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns an instance of CollectionItemSubset that contains reduced information for each item that the calling user can access in the installation.
   * If no collection identifier is provided, all items from all collections will be retrieved.
   *
   * @param {string} [collectionId] - Collection id (optional).
   * @param {number} [limit] - Limit for pagination (optional).
   * @param {number} [offset] - Offset for pagination (optional).
   * @returns {Promise<CollectionItemSubset>}
   */
  async execute(
    collectionId?: string,
    limit?: number,
    offset?: number
  ): Promise<CollectionItemSubset> {
    return await this.collectionsRepository.getCollectionItems(collectionId, limit, offset)
  }
}
