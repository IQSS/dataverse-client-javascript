import { CreateGuestbookDTO } from '../dtos/CreateGuestbookDTO'
import { Guestbook } from '../models/Guestbook'
import { GuestbookResponseSubset } from '../models/GuestbookResponse'

export interface IGuestbooksRepository {
  createGuestbook(
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ): Promise<number>
  getGuestbook(guestbookId: number): Promise<Guestbook>
  getGuestbooksByCollectionId(
    collectionIdOrAlias: number | string,
    includeStats?: boolean,
    includeInherited?: boolean
  ): Promise<Guestbook[]>
  getGuestbookResponsesByGuestbookId(
    guestbookId: number,
    limit?: number,
    offset?: number
  ): Promise<GuestbookResponseSubset>
  downloadGuestbookResponsesByCollectionId(
    collectionIdOrAlias: number | string,
    guestbookId?: number
  ): Promise<string>
  setGuestbookEnabled(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void>
  assignDatasetGuestbook(datasetId: number | string, guestbookId: number): Promise<void>
  removeDatasetGuestbook(datasetId: number | string): Promise<void>
}
