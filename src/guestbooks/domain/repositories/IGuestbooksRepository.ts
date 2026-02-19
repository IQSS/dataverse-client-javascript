import { CreateGuestbookDTO } from '../dtos/CreateGuestbookDTO'
import { Guestbook } from '../models/Guestbook'

export interface IGuestbooksRepository {
  createGuestbook(
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ): Promise<void>
  getGuestbook(guestbookId: number): Promise<Guestbook>
  getGuestbooksBycollectionId(collectionIdOrAlias: number | string): Promise<Guestbook[]>
  setGuestbookEnabled(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void>
}
