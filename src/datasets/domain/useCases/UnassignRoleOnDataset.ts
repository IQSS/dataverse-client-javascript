import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class UnassignRoleOnDataset implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Deletes the given role assignment on the given dataset.
   *
   * @param {number | string} [datasetId] - The dataset identifier, which can be a string (for persistent identifiers), or a number (for numeric identifiers).
   * @param {number} [roleAssignmentId] - To numeric identifier of the role assignment
   * @returns {Promise<void>}
   */
  async execute(
    datasetId: number | string,
    roleAssignmentId: number
  ): Promise<void> {
    return await this.datasetsRepository.unassignRoleOnDataset(datasetId, roleAssignmentId)
  }
}
