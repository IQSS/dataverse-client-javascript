import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CollectionDTO } from '../dtos/CollectionDTO'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class UpdateCollection implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Updates an existing collection, given a collection identifier and a CollectionDTO including the updated collection data.
   *
   * @param {number | string} [collectionIdOrAlias] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * @param {CollectionDTO} [newCollection] - CollectionDTO object including the updated collection data.
   * @returns {Promise<void>} -This method does not return anything upon successful completion.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(
    collectionIdOrAlias: number | string,
    updatedCollection: CollectionDTO
  ): Promise<void> {
    return await this.collectionsRepository.updateCollection(collectionIdOrAlias, updatedCollection)
  }
}
