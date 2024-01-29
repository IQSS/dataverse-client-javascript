import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';
import { DatasetNotNumberedVersion } from '../../../datasets';
import { FileNotNumberedVersion } from '../models/FileNotNumberedVersion';

export class GetFile {
  constructor(private readonly filesRepository: IFilesRepository) {}

  async execute(
    fileId: number | string,
    fileVersionId: string | DatasetNotNumberedVersion = FileNotNumberedVersion.LATEST,
  ): Promise<File> {
    return await this.filesRepository.getFile(fileId, fileVersionId);
  }
}
