import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ID } from '../models/Collection'
import { Role } from '../../../roles/domain/models/Role'

export class GetDefaultContributorRole implements UseCase<Role> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns the default Role that is assigned to contributors in the given collection.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @returns {Promise<Role>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<Role> {
    return await this.collectionsRepository.getDefaultContributorRole(collectionIdOrAlias)
  }
}
