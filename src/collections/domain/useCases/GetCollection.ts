import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { Collection, ROOT_COLLECTION_ALIAS } from '../models/Collection'

export class GetCollection implements UseCase<Collection> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns a Collection instance, given the search parameters to identify it.
   *
   * @param {number | string} [collectionIdOrAlias = 'root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: 'root'
   * @returns {Promise<Collection>}
   */
  async execute(collectionIdOrAlias: number | string = ROOT_COLLECTION_ALIAS): Promise<Collection> {
    return await this.collectionsRepository.getCollection(collectionIdOrAlias)
  }
}
