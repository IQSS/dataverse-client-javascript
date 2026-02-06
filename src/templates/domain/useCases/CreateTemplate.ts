import { ROOT_COLLECTION_ID } from '../../../collections/domain/models/Collection'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CreateTemplateDTO } from '../dtos/CreateTemplateDTO'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class CreateTemplate implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Creates a template in the specified collection.
   *
   * @param {CreateTemplateDTO} template - Template definition payload.
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'.
   * @returns {Promise<void>}
   */
  async execute(
    template: CreateTemplateDTO,
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<void> {
    return await this.templatesRepository.createTemplate(collectionIdOrAlias, template)
  }
}
