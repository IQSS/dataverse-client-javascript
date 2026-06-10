import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponseSubset } from '../models/GuestbookResponse'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class GetGuestbookResponsesByGuestbookId implements UseCase<GuestbookResponseSubset> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Returns paginated guestbook responses for one guestbook.
   *
   * @param {number} guestbookId - Guestbook identifier.
   * @param {number} limit - Maximum number of responses to return.
   * @param {number} offset - Number of responses to skip.
   * @returns {Promise<GuestbookResponseSubset>}
   */
  async execute(guestbookId: number, limit = 10, offset = 0): Promise<GuestbookResponseSubset> {
    return await this.guestbooksRepository.getGuestbookResponsesByGuestbookId(
      guestbookId,
      limit,
      offset
    )
  }
}
