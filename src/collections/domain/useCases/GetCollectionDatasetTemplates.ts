import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ID } from '../models/Collection'
import { CollectionDatasetTemplate } from '../models/CollectionDatasetTemplate'

export class GetCollectionDatasetTemplates implements UseCase<CollectionDatasetTemplate[]> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns a CollectionDatasetTemplate array containing the dataset templates of the requested collection, given the collection identifier or alias.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @returns {Promise<CollectionDatasetTemplate[]>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<CollectionDatasetTemplate[]> {
    return await this.collectionsRepository.getCollectionDatasetTemplates(collectionIdOrAlias)
  }
}
