import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class AssignDatasetGuestbook implements UseCase<void> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Assigns a guestbook to a dataset.
   *
   * @param {number | string} datasetId - Dataset identifier (persistent id or numeric id).
   * @param {number} guestbookId - Guestbook numeric identifier.
   * @returns {Promise<void>}
   */
  async execute(datasetId: number | string, guestbookId: number): Promise<void> {
    return await this.guestbooksRepository.assignDatasetGuestbook(datasetId, guestbookId)
  }
}
