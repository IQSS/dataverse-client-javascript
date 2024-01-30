import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';
import { DatasetNotNumberedVersion } from '../../../datasets';

export class GetFile {
  constructor(private readonly filesRepository: IFilesRepository) {}

  async execute(
    fileId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
  ): Promise<File> {
    return await this.filesRepository.getFile(fileId, datasetVersionId);
  }
}
