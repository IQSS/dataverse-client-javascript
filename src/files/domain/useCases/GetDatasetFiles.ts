import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';
import { FileSearchCriteria, FileOrderCriteria } from '../models/FileCriteria';
import { DatasetNotNumberedVersion } from '../../../datasets';

export class GetDatasetFiles implements UseCase<File[]> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned = false,
    limit?: number,
    offset?: number,
    fileSearchCriteria?: FileSearchCriteria,
    fileOrderCriteria: FileOrderCriteria = FileOrderCriteria.NAME_AZ,
  ): Promise<File[]> {
    return await this.filesRepository.getDatasetFiles(
      datasetId,
      datasetVersionId,
      includeDeaccessioned,
      fileOrderCriteria,
      limit,
      offset,
      fileSearchCriteria,
    );
  }
}
