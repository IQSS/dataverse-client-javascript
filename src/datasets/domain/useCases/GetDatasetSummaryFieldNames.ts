import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';

export class GetDatasetSummaryFieldNames implements UseCase<string[]> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(): Promise<string[]> {
    return await this.datasetsRepository.getDatasetSummaryFieldNames();
  }
}
