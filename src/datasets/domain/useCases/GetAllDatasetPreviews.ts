import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { DatasetPreviewSubset } from '../models/DatasetPreviewSubset';

export class GetAllDatasetPreviews implements UseCase<DatasetPreviewSubset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(limit?: number, offset?: number): Promise<DatasetPreviewSubset> {
    return await this.datasetsRepository.getAllDatasetPreviews(limit, offset);
  }
}
