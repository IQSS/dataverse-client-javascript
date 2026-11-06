import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ID } from '../models/Collection'
import { RoleAlias } from '../../../roles/domain/models/RoleAlias'

export class SetDefaultContributorRole implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Sets the default Role that is assigned to contributors in the given collection.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @param {RoleAlias | string} [roleAlias] - The alias of the role to be assigned
   * @returns {Promise<void>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID,
    roleAlias: RoleAlias | string
  ): Promise<void> {
    return await this.collectionsRepository.setDefaultContributorRole(
      collectionIdOrAlias,
      roleAlias
    )
  }
}
