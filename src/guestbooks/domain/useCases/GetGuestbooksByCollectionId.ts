import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'
import { Guestbook } from '../models/Guestbook'

export class GetGuestbooksByCollectionId implements UseCase<Guestbook[]> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Returns all guestbooks available for a given collection.
   *
   * @param {number | string} collectionIdOrAlias - Collection identifier (numeric id or alias).
   * @returns {Promise<Guestbook[]>}
   */
  async execute(collectionIdOrAlias: number | string): Promise<Guestbook[]> {
    return await this.guestbooksRepository.getGuestbooksByCollectionId(collectionIdOrAlias)
  }
}
