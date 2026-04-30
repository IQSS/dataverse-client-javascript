import { CreateGuestbookDTO } from '../dtos/CreateGuestbookDTO'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class CreateGuestbook {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Creates a guestbook for the given collection.
   *
   * @param {CreateGuestbookDTO} guestbook - Guestbook creation payload.
   * @param {number | string} collectionIdOrAlias - Collection identifier (numeric id or alias).
   * @returns {Promise<number>} - The created guestbook identifier.
   */
  async execute(
    guestbook: CreateGuestbookDTO,
    collectionIdOrAlias: number | string
  ): Promise<number> {
    return await this.guestbooksRepository.createGuestbook(collectionIdOrAlias, guestbook)
  }
}
