import { EditGuestbookDTO } from '../dtos/EditGuestbookDTO'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class EditGuestbook {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Edits an existing guestbook.
   *
   * @param {number} guestbookId - Guestbook identifier.
   * @param {EditGuestbookDTO} guestbook - Guestbook edit payload.
   * @returns {Promise<void>}
   */
  async execute(guestbookId: number, guestbook: EditGuestbookDTO): Promise<void> {
    return await this.guestbooksRepository.editGuestbook(guestbookId, guestbook)
  }
}
