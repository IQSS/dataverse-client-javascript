import { UseCase } from '../../../core/domain/useCases/UseCase';
import { DatasetPreview } from '../models/DatasetPreview';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';

export class GetAllDatasetPreviews implements UseCase<DatasetPreview[]> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(limit?: number, offset?: number): Promise<DatasetPreview[]> {
    return await this.datasetsRepository.getAllDatasetPreviews(limit, offset);
  }
}
