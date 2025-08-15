import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetNotNumberedVersion } from '../models/DatasetNotNumberedVersion'
import { FormattedCitation } from '../models/FormattedCitation'
import { CitationFormat } from '../models/CitationFormat'

export class GetDatasetCitationInOtherFormats implements UseCase<FormattedCitation> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Returns the dataset citation in the specified format.
   *
   * @param {number | string} datasetId - The dataset identifier.
   * @param {string | DatasetNotNumberedVersion} [datasetVersionId=DatasetNotNumberedVersion.LATEST] - The dataset version identifier, which can be a version-specific string (e.g., '1.0') or a DatasetNotNumberedVersion enum value. Defaults to LATEST.
   * @param {CitationFormat} format - The citation format to return. One of: 'EndNote', 'RIS', 'BibTeX', 'CSLJson', 'Internal'.
   * @param {boolean} [includeDeaccessioned=false] - Whether to include deaccessioned versions in the search. Defaults to false.
   * @returns {Promise<FormattedCitation>} The citation content, format, and content type.
   */
  async execute(
    datasetId: number | string,
    datasetVersionId: string | DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST,
    format: CitationFormat,
    includeDeaccessioned = false
  ): Promise<FormattedCitation> {
    return await this.datasetsRepository.getDatasetCitationInOtherFormats(
      datasetId,
      datasetVersionId,
      format,
      includeDeaccessioned
    )
  }
}
