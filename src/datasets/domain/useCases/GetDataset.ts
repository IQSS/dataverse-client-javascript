import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDatasetsRepository } from '../repositories/IDatasetsRepository';
import { Dataset } from '../models/Dataset';
import { DatasetNotNumberedVersion } from '../models/DatasetNotNumberedVersion';

export class GetDataset implements UseCase<Dataset> {
  private datasetsRepository: IDatasetsRepository;

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository;
  }

  /**
   * Returns a Dataset instance, given the search parameters to identify it.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific numeric string (for example, 1.0) or a DatasetNotNumberedVersion enum value. If this parameter is not set, the default value is: DatasetNotNumberedVersion.LATEST
   * @param {boolean} [includeDeaccessioned=false] - Indicates whether to consider deaccessioned versions in the dataset search or not. The default value is false
   * @returns {Promise<Dataset>}
   */
  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    includeDeaccessioned: boolean = false,
  ): Promise<Dataset> {
    return await this.datasetsRepository.getDataset(datasetId, datasetVersionId, includeDeaccessioned);
  }
}
