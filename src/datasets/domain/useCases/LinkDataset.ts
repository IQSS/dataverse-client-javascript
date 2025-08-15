import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class LinkDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Creates a link between a Dataset and a Collection.
   *
   * @param {number} [datasetId] - The dataset id.
   * @param {string} [collectionAlias] - The collection alias.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(datasetId: number, collectionAlias: string): Promise<void> {
    return await this.datasetsRepository.linkDataset(datasetId, collectionAlias)
  }
}
