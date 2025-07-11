import { UseCase } from '../../../core/domain/useCases/UseCase'
import { FeaturedItemsDTO } from '../dtos/FeaturedItemsDTO'
import { ROOT_COLLECTION_ID } from '../models/Collection'
import { FeaturedItem } from '../models/FeaturedItem'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class UpdateCollectionFeaturedItems implements UseCase<FeaturedItem[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Updates all featured items, given a collection identifier and a FeaturedItemsDTO.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @param {FeaturedItemsDTO} [featuredItemsDTO] - FeaturedItemsDTO object including the updated collection featured items data.
   * @returns {Promise<FeaturedItem[]>} -This method returns the updated collection featured items upon successful completion.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID,
    featuredItemsDTO: FeaturedItemsDTO
  ): Promise<FeaturedItem[]> {
    return await this.collectionsRepository.updateCollectionFeaturedItems(
      collectionIdOrAlias,
      featuredItemsDTO
    )
  }
}
