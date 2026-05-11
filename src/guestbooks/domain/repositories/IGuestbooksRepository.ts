import { CreateGuestbookDTO } from '../dtos/CreateGuestbookDTO'
import { Guestbook } from '../models/Guestbook'

export interface IGuestbooksRepository {
  createGuestbook(
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ): Promise<number>
  getGuestbook(guestbookId: number): Promise<Guestbook>
  getGuestbooksByCollectionId(
    collectionIdOrAlias: number | string,
    includeStats?: boolean
  ): Promise<Guestbook[]>
  setGuestbookEnabled(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void>
  assignDatasetGuestbook(datasetId: number | string, guestbookId: number): Promise<void>
  removeDatasetGuestbook(datasetId: number | string): Promise<void>
}
