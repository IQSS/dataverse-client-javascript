import { ROOT_COLLECTION_ID } from '../../../collections/domain/models/Collection'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CreateDatasetTemplateDTO } from '../dtos/CreateDatasetTemplateDTO'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class CreateDatasetTemplate implements UseCase<void> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
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
    return await this.templatesRepository.createDatasetTemplate(collectionIdOrAlias, template)
  }
}
