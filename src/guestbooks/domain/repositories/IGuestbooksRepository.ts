import { CreateGuestbookDTO } from '../dtos/CreateGuestbookDTO'
import { Guestbook } from '../models/Guestbook'
import { GuestbookResponse } from '../models/GuestbookResponse'

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
  getGuestbookResponsesByDataverseId(
    dataverseId: number | string,
    guestbookId?: number
  ): Promise<GuestbookResponse[]>
  downloadGuestbookResponsesByDataverseId(
    dataverseId: number | string,
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
