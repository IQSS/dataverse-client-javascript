import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { Dataset } from '../models/Dataset'

export class GetPrivateUrlDataset implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns a Dataset instance, given an associated Private URL Token.
   *
   * @param {string} [token] - A Private URL token.
   * @param {boolean} [keepRawFields=true] - Indicates whether or not the use case should keep the metadata fields as they are and avoid the transformation to markdown. The default value is true.
   * @returns {Promise<Dataset>}
   */
  async execute(token: string, keepRawFields = true): Promise<Dataset> {
    return await this.datasetsRepository.getPrivateUrlDataset(token, keepRawFields)
  }
}
