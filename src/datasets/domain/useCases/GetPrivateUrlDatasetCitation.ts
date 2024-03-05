import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class GetPrivateUrlDatasetCitation implements UseCase<string> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the Dataset citation text, given an associated Private URL Token.
   *
   * @param {string} [token] - A Private URL token.
   * @returns {Promise<string>}
   */
  async execute(token: string): Promise<string> {
    return await this.datasetsRepository.getPrivateUrlDatasetCitation(token)
  }
}
