import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { AllowedStorageDrivers } from '../models/AllowedStorageDrivers'

export class GetAllowedCollectionStorageDrivers implements UseCase<AllowedStorageDrivers> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  async execute(collectionIdOrAlias: number | string): Promise<AllowedStorageDrivers> {
    return this.collectionsRepository.getAllowedCollectionStorageDrivers(collectionIdOrAlias)
  }
}
