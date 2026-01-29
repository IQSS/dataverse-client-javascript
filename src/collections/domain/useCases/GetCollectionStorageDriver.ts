import { UseCase } from '../../../core/domain/useCases/UseCase'
import { StorageDriver } from '../../../datasets/domain/models/StorageDriver'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class GetCollectionStorageDriver implements UseCase<StorageDriver> {
  private readonly collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Returns the storage driver information for a given Collection.
   *
   * @param {number | string} collectionIdOrAlias - The collection identifier, which can be a string (alias) or numeric id.
   * @param {boolean} [getEffective=false] - Whether to resolve the effective storage driver up the parent chain.
   * @returns {Promise<StorageDriver>}
   */
  async execute(
    collectionIdOrAlias: number | string,
    getEffective = false
  ): Promise<StorageDriver> {
    return this.collectionsRepository.getCollectionStorageDriver(collectionIdOrAlias, getEffective)
  }
}
