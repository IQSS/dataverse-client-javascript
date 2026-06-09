import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponse } from '../models/GuestbookResponse'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class GetGuestbookResponsesByGuestbookId implements UseCase<GuestbookResponse[]> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Returns guestbook responses for one guestbook.
   *
   * @param {number} guestbookId - Guestbook identifier.
   * @param {number} limit - Maximum number of responses to return.
   * @param {number} offset - Number of responses to skip.
   * @returns {Promise<GuestbookResponse[]>}
   */
  async execute(guestbookId: number, limit = 10, offset = 0): Promise<GuestbookResponse[]> {
    return await this.guestbooksRepository.getGuestbookResponsesByGuestbookId(
      guestbookId,
      limit,
      offset
    )
  }
}
