import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class GetCollectionUserPermissions implements UseCase<CollectionUserPermissions> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns an instance of CollectionUserPermissions that includes the permissions that the calling user has on a particular Collection.
   *
   * @param {number | string} [collectionIdOrAlias = 'root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: 'root'
   * @returns {Promise<CollectionUserPermissions>}
   */
  async execute(collectionIdOrAlias: number | string): Promise<CollectionUserPermissions> {
    return await this.collectionsRepository.getCollectionUserPermissions(collectionIdOrAlias)
  }
}
