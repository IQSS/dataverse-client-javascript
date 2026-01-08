import { ROOT_COLLECTION_ID } from '../../../collections/domain/models/Collection'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { Template } from '../models/Template'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class GetDatasetTemplates implements UseCase<Template[]> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Returns a Template array containing the templates of the requested collection, given the collection identifier or alias.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @returns {Promise<Template[]>}
   */
  async execute(collectionIdOrAlias: number | string = ROOT_COLLECTION_ID): Promise<Template[]> {
    return await this.templatesRepository.getDatasetTemplates(collectionIdOrAlias)
  }
}
