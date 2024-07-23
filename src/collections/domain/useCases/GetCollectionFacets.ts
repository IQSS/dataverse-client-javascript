import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ALIAS } from '../models/Collection'

export class GetCollectionFacets implements UseCase<string[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns the names of the configured collection facets, given a collection identifier or alias.
   *
   * @param {number | string} [collectionIdOrAlias = 'root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: 'root'
   * @returns {Promise<string[]>}
   */
  async execute(collectionIdOrAlias: number | string = ROOT_COLLECTION_ALIAS): Promise<string[]> {
    return await this.collectionsRepository.getCollectionFacets(collectionIdOrAlias)
  }
}
