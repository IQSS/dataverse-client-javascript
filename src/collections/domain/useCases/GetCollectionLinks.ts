import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { CollectionLinks } from '../models/CollectionLinks'

export class GetCollectionItems implements UseCase<CollectionLinks> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns a CollectionLinks object containing other collections this collection is linked to, the other collections linking to this collection, and datasets linked to this collection, given the collection identifier or alias.
   *
   * @param {number | string} [collectionIdOrAlias] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @returns {Promise<CollectionLinks>}
   */
  async execute(collectionId: number | string): Promise<CollectionLinks> {
    return await this.collectionsRepository.getCollectionLinks(collectionId)
  }
}
