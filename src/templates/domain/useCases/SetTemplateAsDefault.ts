import { ROOT_COLLECTION_ID } from '../../../collections/domain/models/Collection'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class SetTemplateAsDefault implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Sets the default template for the specified collection.
   *
   * @param {number} templateId - Template id to set as default.
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'.
   */
  async execute(
    templateId: number,
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<void> {
    return await this.templatesRepository.setTemplateAsDefault(collectionIdOrAlias, templateId)
  }
}
