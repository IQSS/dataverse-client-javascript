import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';

export class GetDatasetCitation implements UseCase<string> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(datasetId: number, datasetVersionId?: string, anonymizedAccess: boolean = false): Promise<string> {
    return await this.datasetsRepository.getDatasetCitation(datasetId, anonymizedAccess, datasetVersionId);
  }
}
