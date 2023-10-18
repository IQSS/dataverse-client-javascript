import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { DatasetUserPermissions } from '../models/DatasetUserPermissions';

export class GetDatasetUserPermissions implements UseCase<DatasetUserPermissions> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(datasetId: number | string): Promise<DatasetUserPermissions> {
    return await this.datasetsRepository.getDatasetUserPermissions(datasetId);
  }
}
