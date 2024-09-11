import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository' // Assuming Axios for HTTP requests

export class PublishCollection implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Publishes a collection, given its identifier.
   *
   * @param {number | string} [collectionIdOrAlias] - The collection identifier, which can be a string (for collection alias), or a number (for numeric identifiers).
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(collectionIdOrAlias: number | string): Promise<void> {
    return await this.collectionsRepository.publishCollection(collectionIdOrAlias)
  }
}
