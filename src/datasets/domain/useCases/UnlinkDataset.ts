import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class UnlinkDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Removes a link between a Dataset and a Collection.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {number | string} [collectionIdOrAlias] - A generic collection identifier, which can be either a string (for queries by CollectionAlias), or a number (for queries by CollectionId)
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(datasetId: number | string, collectionIdOrAlias: number | string): Promise<void> {
    return await this.datasetsRepository.unlinkDataset(datasetId, collectionIdOrAlias)
  }
}
