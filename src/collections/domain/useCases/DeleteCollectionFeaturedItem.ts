import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class DeleteCollectionFeaturedItem implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Deletes a single featured item, given a featured item id.
   *
   * @param {number} [featuredItemId] - The id of the featured item to delete.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   * @throws {WriteError} - If there are errors while writing data.
   */
  async execute(featuredItemId: number): Promise<void> {
    return await this.collectionsRepository.deleteCollectionFeaturedItem(featuredItemId)
  }
}
