import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'
import { Guestbook } from '../models/Guestbook'

export class GetGuestbook implements UseCase<Guestbook> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Returns a guestbook by id.
   *
   * @param {number} guestbookId - Guestbook identifier.
   * @returns {Promise<Guestbook>}
   */
  async execute(guestbookId: number): Promise<Guestbook> {
    return await this.guestbooksRepository.getGuestbook(guestbookId)
  }
}
