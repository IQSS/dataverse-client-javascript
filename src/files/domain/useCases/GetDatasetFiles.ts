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
    includeDeaccessioned: boolean = false,
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
