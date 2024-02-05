import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { FilesSubset } from '../models/FilesSubset';
import { FileSearchCriteria, FileOrderCriteria } from '../models/FileCriteria';
import { DatasetNotNumberedVersion } from '../../../datasets';

export class GetDatasetFiles implements UseCase<FilesSubset> {
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
  ): Promise<FilesSubset> {
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
