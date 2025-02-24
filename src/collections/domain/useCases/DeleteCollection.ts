import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class DeleteCollection implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Deletes the Dataverse collection whose database ID or alias is given:
   *
   * @param {number | string} [collectionIdOrAlias] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * @returns {Promise<void>} -This method does not return anything upon successful completion.
   */
  async execute(collectionIdOrAlias: number | string): Promise<void> {
    return await this.collectionsRepository.deleteCollection(collectionIdOrAlias)
  }
}
