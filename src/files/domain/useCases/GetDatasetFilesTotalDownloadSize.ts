import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { DatasetNotNumberedVersion } from '../../../datasets';
import { FileDownloadSizeMode } from '../models/FileDownloadSizeMode';
import { FileSearchCriteria } from '../models/FileCriteria';

export class GetDatasetFilesTotalDownloadSize implements UseCase<number> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  /**
   * Returns the combined size in bytes of all the files available for download from a particular Dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @param {FileDownloadSizeMode} [fileDownloadSizeMode=FileDownloadSizeMode.ALL] - Applies a filter mode to the operation to consider only archival sizes, original or both (all). The default value is FileDownloadSizeMode.ALL.
   * @param {FileSearchCriteria} [fileSearchCriteria] - Supports filtering the files to obtain their combined size by different file properties (optional).
   * @param {boolean} [includeDeaccessioned=false] - Indicates whether to consider deaccessioned versions in the dataset search or not. The default value is false.
   * @returns {Promise<number>}
   */
  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    fileDownloadSizeMode: FileDownloadSizeMode = FileDownloadSizeMode.ALL,
    fileSearchCriteria?: FileSearchCriteria,
    includeDeaccessioned: boolean = false,
  ): Promise<number> {
    return await this.filesRepository.getDatasetFilesTotalDownloadSize(
      datasetId,
      datasetVersionId,
      includeDeaccessioned,
      fileDownloadSizeMode,
      fileSearchCriteria,
    );
  }
}
