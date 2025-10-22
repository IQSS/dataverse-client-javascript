import { ROOT_COLLECTION_ID } from '../models/Collection'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { CreateDatasetTemplateDTO } from '../dtos/CreateDatasetTemplateDTO'

export class CreateDatasetTemplate implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Creates a Dataset Template in the specified collection.
   *
   * @param {CreateDatasetTemplateDTO} template - Template definition payload.
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'.
   * @returns {Promise<void>}
   */
  async execute(
    template: CreateDatasetTemplateDTO,
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<void> {
    return await this.collectionsRepository.createDatasetTemplate(collectionIdOrAlias, template)
  }
}
