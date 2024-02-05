import { IFilesRepository } from '../repositories/IFilesRepository';
import { File } from '../models/File';
import { DatasetNotNumberedVersion } from '../../../datasets';

export class GetFile {
  constructor(private readonly filesRepository: IFilesRepository) {}

  /**
   * Returns a File instance, given the search parameters to identify it.
   *
   * @param {number | string} [fileId] - The File identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @returns {Promise<File>}
   */
  async execute(
    fileId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
  ): Promise<File> {
    return await this.filesRepository.getFile(fileId, datasetVersionId);
  }
}
