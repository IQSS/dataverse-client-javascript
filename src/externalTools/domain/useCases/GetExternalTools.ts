import { UseCase } from '../../../core/domain/useCases/UseCase'
import { ExternalTool } from '../models/ExternalTool'
import { IExternalToolsRepository } from '../repositories/IExternalToolsRepository'

export class GetExternalTools implements UseCase<ExternalTool[]> {
  private externalToolsRepository: IExternalToolsRepository

  constructor(externalToolsRepository: IExternalToolsRepository) {
    this.externalToolsRepository = externalToolsRepository
  }

  /**
   * Returns a list containing all the external tools available in the installation.
   *
   * @returns {Promise<ExternalTool[]>}
   */
  async execute(): Promise<ExternalTool[]> {
    return await this.externalToolsRepository.getExternalTools()
  }
}
