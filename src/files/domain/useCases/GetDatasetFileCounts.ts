import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IFilesRepository } from '../repositories/IFilesRepository';
import { DatasetNotNumberedVersion } from '../../../datasets';
import { FileCounts } from '../models/FileCounts';
import { FileSearchCriteria } from '../models/FileCriteria';

export class GetDatasetFileCounts implements UseCase<FileCounts> {
  private filesRepository: IFilesRepository;

  constructor(filesRepository: IFilesRepository) {
    this.filesRepository = filesRepository;
  }

  /**
   * Returns an instance of FileCounts, containing the requested Dataset total file count, as well as file counts for different file properties.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @param {boolean} [includeDeaccessioned=false] - Indicates whether to consider deaccessioned versions in the dataset search or not. The default value is false.
   * @param {FileSearchCriteria} [fileSearchCriteria] - Supports filtering the files by different file properties (optional).
   * @returns {Promise<FileCounts>}
   */
  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned: boolean = false,
    fileSearchCriteria?: FileSearchCriteria,
  ): Promise<FileCounts> {
    return await this.filesRepository.getDatasetFileCounts(
      datasetId,
      datasetVersionId,
      includeDeaccessioned,
      fileSearchCriteria,
    );
  }
}
