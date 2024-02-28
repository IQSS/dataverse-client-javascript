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

  /**
   * Returns an instance of FilesSubset, which contains the files from the requested Dataset and page (if pagination parameters are set).
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @param {boolean} [includeDeaccessioned=false] - Indicates whether to consider deaccessioned versions in the dataset search or not. The default value is false.
   * @param {number} [limit] - Limit for pagination (optional).
   * @param {number} [offset] - Offset for pagination (optional).
   * @param {FileSearchCriteria} [fileSearchCriteria] - Supports filtering the files by different file properties (optional).
   * @param {FileOrderCriteria} [fileOrderCriteria=FileOrderCriteria.NAME_AZ] - Supports ordering the results according to different criteria. If not set, the defalt value is FileOrderCriteria.NAME_AZ.
   * @returns {Promise<FilesSubset>}
   */
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
