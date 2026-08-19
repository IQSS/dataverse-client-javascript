import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ID } from '../models/Collection'

export class AssignRoleOnCollection implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Assigns a new role to someone on the given Dataverse collection.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @param {string} [roleAssignee] - To whom the role should be assigned
   * @param {string} [roleAlias] - The alias of the role to be assigned
   * @returns {Promise<void>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID,
    roleAssignee: string,
    roleAlias: string
  ): Promise<void> {
    return await this.collectionsRepository.assignRoleOnCollection(collectionIdOrAlias, roleAssignee, roleAlias)
  }
}
