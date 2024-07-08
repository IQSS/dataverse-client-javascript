import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CollectionDTO } from '../dtos/CollectionDTO'
import { ROOT_COLLECTION_ALIAS } from '../models/Collection'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class CreateCollection implements UseCase<number> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Creates a new collection, given a CollectionDTO object and an optional collection identifier, which defaults to root.
   *
   * @param {CollectionDTO} [newCollection] - CollectionDTO object including the new collection data.
   * @param {string} [parentCollectionId] - Specifies the parent collection identifier (optional, defaults to root).
   * @returns {Promise<number>} - The created collection identifier.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(
    newCollection: CollectionDTO,
    parentCollectionId: number | string = ROOT_COLLECTION_ALIAS
  ): Promise<number> {
    return await this.collectionsRepository.createCollection(newCollection, parentCollectionId)
  }
}
