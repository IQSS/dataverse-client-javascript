import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class AssignRoleOnDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Assigns a new role to someone on the given dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {string} [roleAssignee] - To whom the role should be assigned
   * @param {string} [roleAlias] - The alias of the role to be assigned
   * @returns {Promise<void>}
   */
  async execute(
    datasetId: number | string,
    roleAssignee: string,
    roleAlias: string
  ): Promise<void> {
    return await this.datasetsRepository.assignRoleOnDataset(datasetId, roleAssignee, roleAlias)
  }
}
