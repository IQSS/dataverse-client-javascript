import { UseCase } from '../../../core/domain/useCases/UseCase'
import { GuestbookResponse } from '../models/GuestbookResponse'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class GetGuestbookResponsesByDataverseId implements UseCase<GuestbookResponse[]> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Returns all guestbook responses for a dataverse collection.
   *
   * @param {number | string} dataverseId - Dataverse identifier.
   * @returns {Promise<GuestbookResponse[]>}
   */
  async execute(dataverseId: number | string): Promise<GuestbookResponse[]> {
    return await this.guestbooksRepository.getGuestbookResponsesByDataverseId(dataverseId)
  }
}
