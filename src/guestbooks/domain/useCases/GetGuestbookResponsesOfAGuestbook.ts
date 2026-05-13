import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponse } from '../models/GuestbookResponse'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class GetGuestbookResponsesOfAGuestbook implements UseCase<GuestbookResponse[]> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Returns guestbook responses for one guestbook in a dataverse collection.
   *
   * @param {number | string} dataverseId - Dataverse identifier.
   * @param {number} guestbookId - Guestbook identifier filter.
   * @returns {Promise<GuestbookResponse[]>}
   */
  async execute(dataverseId: number | string, guestbookId: number): Promise<GuestbookResponse[]> {
    return await this.guestbooksRepository.getGuestbookResponsesByDataverseId(
      dataverseId,
      guestbookId
    )
  }
}
