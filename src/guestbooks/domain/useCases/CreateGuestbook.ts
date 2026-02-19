import { UseCase } from '../../../core/domain/useCases/UseCase'
import { CreateGuestbookDTO } from '../dtos/CreateGuestbookDTO'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class CreateGuestbook implements UseCase<void> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Creates a guestbook for the given collection.
   *
   * @param {CreateGuestbookDTO} guestbook - Guestbook creation payload.
   * @param {number | string} collectionIdOrAlias - Collection identifier (numeric id or alias).
   * @returns {Promise<void>}
   */
  async execute(guestbook: CreateGuestbookDTO, collectionIdOrAlias: number | string) {
    return await this.guestbooksRepository.createGuestbook(collectionIdOrAlias, guestbook)
  }
}
