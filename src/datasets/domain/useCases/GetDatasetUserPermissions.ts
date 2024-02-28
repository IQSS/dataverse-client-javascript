import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { DatasetUserPermissions } from '../models/DatasetUserPermissions';

export class GetDatasetUserPermissions implements UseCase<DatasetUserPermissions> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  /**
   * Returns an instance of DatasetUserPermissions that includes the permissions that the calling user has on a particular Dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @returns {Promise<DatasetUserPermissions>}
   */
  async execute(datasetId: number | string): Promise<DatasetUserPermissions> {
    return await this.datasetsRepository.getDatasetUserPermissions(datasetId);
  }
}
