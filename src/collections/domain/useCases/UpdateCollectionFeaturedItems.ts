import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CollectionFeaturedItemsDTO } from '../dtos/CollectionFeaturedItemsDTO'
import { ROOT_COLLECTION_ID } from '../models/Collection'
import { CollectionFeaturedItem } from '../models/CollectionFeaturedItem'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class UpdateCollectionFeaturedItems implements UseCase<CollectionFeaturedItem[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Updates all featured items, given a collection identifier and a CollectionFeaturedItemsDTO.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @param {CollectionFeaturedItemsDTO} [newCollectionFeaturedItems] - CollectionFeaturedItemsDTO object including the updated collection featured items data.
   * @returns {Promise<CollectionFeaturedItem[]>} -This method returns the updated collection featured items upon successful completion.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID,
    featuredItemsDTO: CollectionFeaturedItemsDTO
  ): Promise<CollectionFeaturedItem[]> {
    return await this.collectionsRepository.updateCollectionFeaturedItems(
      collectionIdOrAlias,
      featuredItemsDTO
    )
  }
}
