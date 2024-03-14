import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { Collection } from '../models/Collection'

export class GetCollection implements UseCase<Collection> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns a Collection instance, given the search parameters to identify it.
   *
   * https://guides.dataverse.org/en/6.0/api/native-api.html#view-a-dataverse-collection
   * @param {number | string} [collectionId] - The collection identifier ...
   * @returns {Promise<Collection>}
   */
  async execute(collectionId: number): Promise<Collection> {
    return await this.collectionsRepository.getCollection(collectionId)
  }
}
