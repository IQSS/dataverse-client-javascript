import { UseCase } from '../../../core/domain/useCases/UseCase'
import { StorageDriver } from '../../../core/domain/models/StorageDriver'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class GetCollectionStorageDriver implements UseCase<StorageDriver> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  async execute(
    collectionIdOrAlias: number | string,
    getEffective = false
  ): Promise<StorageDriver> {
    return this.collectionsRepository.getCollectionStorageDriver(collectionIdOrAlias, getEffective)
  }
}
