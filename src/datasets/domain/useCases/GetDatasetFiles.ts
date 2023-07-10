import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { File } from '../../../files';
import { DatasetFileOrderCriteria } from '../repositories/DatasetFileOrderCriteria';

export class GetDatasetFiles implements UseCase<File[]> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  async execute(
    datasetId: string,
    datasetVersionId?: string,
    limit?: number,
    offset?: number,
    orderCriteria?: DatasetFileOrderCriteria,
  ): Promise<File[]> {
    return await this.datasetsRepository.getDatasetFiles(datasetId, datasetVersionId, limit, offset, orderCriteria);
  }
}
