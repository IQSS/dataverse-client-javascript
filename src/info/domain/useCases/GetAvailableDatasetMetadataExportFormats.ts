import { UseCase } from '../../../core/domain/useCases/UseCase'
import { DatasetMetadataExportFormats } from '../models/DatasetMetadataExportFormats'
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository'

export class GetAvailableDatasetMetadataExportFormats
  implements UseCase<DatasetMetadataExportFormats>
{
  private dataverseInfoRepository: IDataverseInfoRepository

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository
  }

  /**
   * Returns a DatasetMetadataExportFormats object containing the available dataset metadata export formats.
   *
   * @returns {Promise<DatasetMetadataExportFormats>}
   */
  async execute(): Promise<DatasetMetadataExportFormats> {
    return await this.dataverseInfoRepository.getAvailableDatasetMetadataExportFormats()
  }
}
