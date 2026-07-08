import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetNotNumberedVersion } from '../models/DatasetNotNumberedVersion'
import { ExportedDatasetMetadata } from '../models/ExportedDatasetMetadata'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class ExportDatasetMetadata implements UseCase<ExportedDatasetMetadata> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Exports dataset metadata in the specified metadata export format.
   *
   * @param {number | string} datasetId - The dataset identifier, which can be a string for persistent identifiers or a number for numeric identifiers.
   * @param {string} exporter - The metadata exporter format name.
   * @param {DatasetNotNumberedVersion.LATEST_PUBLISHED | DatasetNotNumberedVersion.DRAFT} [version] - The dataset version to export. If omitted, Dataverse defaults to :latest-published.
   * @returns {Promise<ExportedDatasetMetadata>} The exported metadata content and content type.
   */
  async execute(
    datasetId: number | string,
    exporter: string,
    version?: DatasetNotNumberedVersion.LATEST_PUBLISHED | DatasetNotNumberedVersion.DRAFT
  ): Promise<ExportedDatasetMetadata> {
    return await this.datasetsRepository.exportDatasetMetadata(datasetId, exporter, version)
  }
}
