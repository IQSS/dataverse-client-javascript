import { ROOT_COLLECTION_ID } from '../../../collections/domain/models/Collection'
import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetTemplate } from '../models/DatasetTemplate'
import { ITemplatesRepository } from '../repositories/ITemplatesRepository'

export class GetDatasetTemplates implements UseCase<DatasetTemplate[]> {
  private templatesRepository: ITemplatesRepository

  constructor(templatesRepository: ITemplatesRepository) {
    this.templatesRepository = templatesRepository
  }

  /**
   * Returns a DatasetTemplate array containing the dataset templates of the requested collection, given the collection identifier or alias.
   *
   * @param {number | string} [collectionIdOrAlias = ':root'] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * If this parameter is not set, the default value is: ':root'
   * @returns {Promise<DatasetTemplate[]>}
   */
  async execute(
    collectionIdOrAlias: number | string = ROOT_COLLECTION_ID
  ): Promise<DatasetTemplate[]> {
    return await this.templatesRepository.getDatasetTemplates(collectionIdOrAlias)
  }
}
