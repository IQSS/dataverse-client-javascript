import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { ROOT_COLLECTION_ID } from '../models/Collection'

export class UnassignRoleOnCollection implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Deletes the given role assignment on the given Dataverse collection.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @param {number} [roleAssignmentId] - To numeric identifier of the role assignment
   * @returns {Promise<void>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID,
    roleAssignmentId: number
  ): Promise<void> {
    return await this.collectionsRepository.unassignRoleOnCollection(collectionIdOrAlias, roleAssignmentId)
  }
}
