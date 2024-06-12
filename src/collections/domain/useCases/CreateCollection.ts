import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CollectionDTO } from '../dtos/CollectionDTO'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'

export class CreateCollection implements UseCase<number> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * TODO
   */
  async execute(newCollection: CollectionDTO, parentCollectionId = 'root'): Promise<number> {
    return await this.collectionsRepository.createCollection(newCollection, parentCollectionId)
  }
}
