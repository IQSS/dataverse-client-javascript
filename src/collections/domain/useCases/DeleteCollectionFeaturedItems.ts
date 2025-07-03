import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ROOT_COLLECTION_ID } from '../models/Collection'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class DeleteCollectionFeaturedItems implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Deletes all featured items from a collection, given a collection identifier.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(collectionIdOrAlias: number | string = ROOT_COLLECTION_ID): Promise<void> {
    return await this.collectionsRepository.deleteCollectionFeaturedItems(collectionIdOrAlias)
  }
}
