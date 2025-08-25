import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GetExternalToolDTO } from '../dtos/GetExternalToolDTO'
import { DatasetExternalToolResolved } from '../models/ExternalTool'
import { IExternalToolsRepository } from '../repositories/IExternalToolsRepository'

export class GetDatasetExternalToolResolved implements UseCase<DatasetExternalToolResolved> {
  private externalToolsRepository: IExternalToolsRepository

  constructor(externalToolsRepository: IExternalToolsRepository) {
    this.externalToolsRepository = externalToolsRepository
  }

  /**
   * Returns a DatasetExternalToolResolved object containing the resolved URL for accessing an external tool that operates at the dataset level.
   * The URL includes necessary authentication tokens and parameters based on the user's permissions and the tool's configuration.
   * Authentication is required for draft or deaccessioned datasets and the user must have ViewUnpublishedDataset permission.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {number} toolId - The identifier of the external tool.
   * @param {GetExternalToolDTO} getExternalToolDTO - The GetExternalToolDTO object containing additional parameters for the request.
   * @returns {Promise<DatasetExternalToolResolved>}
   */
  async execute(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolResolved> {
    return await this.externalToolsRepository.getDatasetExternalToolResolved(
      datasetId,
      toolId,
      getExternalToolDTO
    )
  }
}
