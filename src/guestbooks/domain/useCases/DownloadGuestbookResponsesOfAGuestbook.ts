import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IGuestbooksRepository } from '../repositories/IGuestbooksRepository'

export class DownloadGuestbookResponsesOfAGuestbook implements UseCase<string> {
  constructor(private readonly guestbooksRepository: IGuestbooksRepository) {}

  /**
   * Downloads guestbook responses for one guestbook in a collection.
   *
   * @param {number | string} collectionIdOrAlias - Collection alias/identifier or numeric database id.
   * @param {number} guestbookId - Guestbook identifier to restrict the export.
   * @returns {Promise<string>} Raw response body returned by the Dataverse API.
   */
  async execute(collectionIdOrAlias: number | string, guestbookId: number): Promise<string> {
    return await this.guestbooksRepository.downloadGuestbookResponsesByCollectionId(
      collectionIdOrAlias,
      guestbookId
    )
  }
}
