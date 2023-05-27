import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';

export class GetPrivateUrlDatasetCitation implements UseCase<string> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(token: string): Promise<string> {
    return await this.datasetsRepository.getPrivateUrlDatasetCitation(token);
  }
}
