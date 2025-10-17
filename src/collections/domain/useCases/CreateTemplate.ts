import { ROOT_COLLECTION_ID } from '../models/Collection'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ICollectionsRepository } from '../repositories/ICollectionsRepository'
import { TemplateCreateDTO } from '../dtos/TemplateCreateDTO'

export class CreateTemplate implements UseCase<void> {
  private collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this.collectionsRepository = collectionsRepository
  }

  /**
   * Creates a Dataset Template in the specified collection.
   *
   * @param {TemplateCreateDTO} template - Template definition payload.
   * @param {number | string} [collectionIdOrAlias = ':root'] - Target collection id or alias.
   * @returns {Promise<void>}
   */
  async execute(
    template: TemplateCreateDTO,
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<void> {
    return await this.collectionsRepository.createTemplate(collectionIdOrAlias, template)
  }
}
