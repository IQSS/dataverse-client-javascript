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
   * @param {number | string} [datasetId] - The dataset id (numeric) or persistent identifier string.
   * @param {number | string} [collectionIdOrAlias] - The collection identifier (numeric id) or alias.
   * @returns {Promise<void>} - This method does not return anything upon successful completion.
   */
  async execute(datasetId: number | string, collectionIdOrAlias: number | string): Promise<void> {
    return await this.datasetsRepository.unlinkDataset(datasetId, collectionIdOrAlias)
  }
}
