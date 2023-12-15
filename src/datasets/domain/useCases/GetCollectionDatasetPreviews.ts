import { UseCase } from '../../../core/domain/useCases/UseCase';
import { DatasetPreview } from '../models/DatasetPreview';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';

export class GetCollectionDatasetPreviews implements UseCase<DatasetPreview[]> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(collectionId: number | string): Promise<DatasetPreview[]> {
    return await this.datasetsRepository.getCollectionDatasetPreviews(collectionId);
  }
}
