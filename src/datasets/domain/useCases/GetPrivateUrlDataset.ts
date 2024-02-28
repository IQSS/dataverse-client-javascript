import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { Dataset } from '../models/Dataset';

export class GetPrivateUrlDataset implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  /**
   * Returns a Dataset instance, given an associated Private URL Token.
   *
   * @param {string} [token] - A Private URL token.
   * @returns {Promise<Dataset>}
   */
  async execute(token: string): Promise<Dataset> {
    return await this.datasetsRepository.getPrivateUrlDataset(token);
  }
}
