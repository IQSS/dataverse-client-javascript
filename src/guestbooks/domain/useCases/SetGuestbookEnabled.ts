import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class SetGuestbookEnabled implements UseCase<void> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Enables or disables a guestbook in a collection.
   *
   * @param {number | string} collectionIdOrAlias - Collection identifier (numeric id or alias).
   * @param {number} guestbookId - Guestbook identifier.
   * @param {boolean} enabled - Desired enabled state.
   * @returns {Promise<void>}
   */
  async execute(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void> {
    return await this.guestbooksRepository.setGuestbookEnabled(
      collectionIdOrAlias,
      guestbookId,
      enabled
    )
  }
}
