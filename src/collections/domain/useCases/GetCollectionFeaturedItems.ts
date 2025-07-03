import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ID } from '../models/Collection'
import { FeaturedItem } from '../models/FeaturedItem'

export class GetCollectionFeaturedItems implements UseCase<FeaturedItem[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns a FeaturedItem array containing the featured items of the requested collection, given the collection identifier or alias.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @returns {Promise<FeaturedItem[]>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<FeaturedItem[]> {
    return await this.collectionsRepository.getCollectionFeaturedItems(collectionIdOrAlias)
  }
}
