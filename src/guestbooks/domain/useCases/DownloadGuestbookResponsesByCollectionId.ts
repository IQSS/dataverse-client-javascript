import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class DownloadGuestbookResponsesByCollectionId implements UseCase<string> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Downloads all guestbook responses for a collection.
   *
   * @param {number | string} collectionIdOrAlias - Collection alias/identifier or numeric database id.
   * @returns {Promise<string>} Raw response body returned by the Dataverse API.
   */
  async execute(collectionIdOrAlias: number | string): Promise<string> {
    return await this.guestbooksRepository.downloadGuestbookResponsesByCollectionId(
      collectionIdOrAlias
    )
  }
}
