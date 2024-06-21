import { IFilesRepository } from '../repositories/IFilesRepository'
import { FileModel } from '../models/FileModel'
import { DatasetNotNumberedVersion, Dataset } from '../../../datasets'
import { UseCase } from '../../../core/domain/useCases/UseCase'

export class GetFileAndDataset implements UseCase<[FileModel, Dataset]> {
  constructor(private readonly filesRepository: IFilesRepository) {}

  /**
   * Returns a tuple including the FileModel instance and the associated Dataset, given the search parameters to identify the File.
   *
   * @param {number | string} [fileId] - The File identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @returns {Promise<[FileModel, Dataset]>}
   */
  async execute(
    fileId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST
  ): Promise<[FileModel, Dataset]> {
    return (await this.filesRepository.getFile(fileId, datasetVersionId, true)) as [
      FileModel,
      Dataset
    ]
  }
}
