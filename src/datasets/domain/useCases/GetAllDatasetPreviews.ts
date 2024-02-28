import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { DatasetPreviewSubset } from '../models/DatasetPreviewSubset';

export class GetAllDatasetPreviews implements UseCase<DatasetPreviewSubset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  /**
   * Returns an instance of DatasetPreviewSubset that contains reduced information for each dataset that the calling user can access in the installation.
   *
   * @param {number} [limit] - Limit for pagination (optional).
   * @param {number} [offset] - Offset for pagination (optional).
   * @param {string} [collectionId] - Collection id (optional).
   * @returns {Promise<DatasetPreviewSubset>}
   */
  async execute(limit?: number, offset?: number, collectionId?: string): Promise<DatasetPreviewSubset> {
    return await this.datasetsRepository.getAllDatasetPreviews(limit, offset, collectionId);
  }
}
