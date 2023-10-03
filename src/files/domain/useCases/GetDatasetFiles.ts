import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';
import { FileCriteria } from '../models/FileCriteria';
import { DatasetNotNumberedVersion } from '../../../datasets';

export class GetDatasetFiles implements UseCase<File[]> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned: boolean = false,
    limit?: number,
    offset?: number,
    fileCriteria?: FileCriteria,
  ): Promise<File[]> {
    return await this.filesRepository.getDatasetFiles(
      datasetId,
      datasetVersionId,
      includeDeaccessioned,
      limit,
      offset,
      fileCriteria,
    );
  }
}
