import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ALIAS } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'

export class GetCollectionFacets implements UseCase<CollectionFacet[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns a CollectionFacet array containing the facets of the requested collection, given the collection identifier or alias.
   *
   * @param {number | string} [collectionIdOrAlias = 'root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: 'root'
   * @returns {Promise<string[]>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ALIAS
  ): Promise<CollectionFacet[]> {
    return await this.collectionsRepository.getCollectionFacets(collectionIdOrAlias)
  }
}
