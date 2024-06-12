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
   * TODO
   */
  async execute(newCollection: CollectionDTO, parentCollectionId: number | string = ROOT_COLLECTION_ALIAS): Promise<number> {
    return await this.collectionsRepository.createCollection(newCollection, parentCollectionId)
  }
}
