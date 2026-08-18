import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class RemoveDatasetGuestbook implements UseCase<void> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Removes guestbook assignment from a dataset.
   *
   * @param {number | string} datasetId - Dataset identifier (persistent id or numeric id).
   * @returns {Promise<void>}
   */
  async execute(datasetId: number | string): Promise<void> {
    return await this.guestbooksRepository.removeDatasetGuestbook(datasetId)
  }
}
