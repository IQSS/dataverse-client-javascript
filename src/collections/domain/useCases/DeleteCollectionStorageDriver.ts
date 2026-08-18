import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class DeleteCollectionStorageDriver implements UseCase<string> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  async execute(collectionIdOrAlias: number | string): Promise<string> {
    return this.collectionsRepository.deleteCollectionStorageDriver(collectionIdOrAlias)
  }
}
