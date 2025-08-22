import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GetExternalToolDTO } from '../dtos/GetExternalToolDTO'
import { FileExternalToolUrl } from '../models/ExternalTool'
import { IExternalToolsRepository } from '../repositories/IExternalToolsRepository'

export class GetFileExternalToolUrl implements UseCase<FileExternalToolUrl> {
  private externalToolsRepository: IExternalToolsRepository

  constructor(externalToolsRepository: IExternalToolsRepository) {
    this.externalToolsRepository = externalToolsRepository
  }

  /**
   * Returns a FileExternalToolUrl object containing the resolved URL for accessing an external tool that operates at the file level.
   * The URL includes necessary authentication tokens and parameters based on the user's permissions and the tool's configuration.
   * Authentication is required for draft, restricted, embargoed, or expired (retention period) files, the user must have appropriate permissions.
   *
   * @param {number | string} [fileId] - The File identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {number} toolId - The identifier of the external tool.
   * @param {GetExternalToolDTO} getExternalToolDTO - The GetExternalToolDTO object containing additional parameters for the request.
   * @returns {Promise<FileExternalToolUrl>}
   */
  async execute(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolUrl> {
    return await this.externalToolsRepository.getFileExternalToolUrl(
      fileId,
      toolId,
      getExternalToolDTO
    )
  }
}
