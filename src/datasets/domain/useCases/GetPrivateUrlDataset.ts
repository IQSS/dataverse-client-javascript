import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { Dataset } from '../models/Dataset';

export class GetPrivateUrlDataset implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(token: string, anonymizedFieldValue?: string): Promise<Dataset> {
    return await this.datasetsRepository.getPrivateUrlDataset(token, anonymizedFieldValue);
  }
}
