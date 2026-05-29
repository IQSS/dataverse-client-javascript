import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class SetCollectionStorageDriver implements UseCase<string> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  async execute(collectionIdOrAlias: number | string, driverLabel: string): Promise<string> {
    return this.collectionsRepository.setCollectionStorageDriver(collectionIdOrAlias, driverLabel)
  }
}
