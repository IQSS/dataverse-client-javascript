import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { CreateGuestbookDTO } from '../../domain/dtos/CreateGuestbookDTO'
import { Guestbook } from '../../domain/models/Guestbook'
import { IGuestbooksRepository } from '../../domain/repositories/IGuestbooksRepository'

export class GuestbooksRepository extends ApiRepository implements IGuestbooksRepository {
  private readonly guestbooksResourceName: string = 'guestbooks'

  public async createGuestbook(
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ): Promise<void> {
    return this.doPost(
      this.buildApiEndpoint(this.guestbooksResourceName, undefined, collectionIdOrAlias),
      guestbook
    )
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async getGuestbook(guestbookId: number): Promise<Guestbook> {
    return this.doGet(
      this.buildApiEndpoint(this.guestbooksResourceName, undefined, guestbookId),
      true
    )
      .then((response) => response.data.data as Guestbook)
      .catch((error) => {
        throw error
      })
  }

  public async getGuestbooksBycollectionId(
    collectionIdOrAlias: number | string
  ): Promise<Guestbook[]> {
    return this.doGet(
      this.buildApiEndpoint(this.guestbooksResourceName, 'list', collectionIdOrAlias),
      true
    )
      .then((response) => response.data.data as Guestbook[])
      .catch((error) => {
        throw error
      })
  }

  public async setGuestbookEnabled(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void> {
    const endpoint = this.buildApiEndpoint(
      this.guestbooksResourceName,
      `${guestbookId}/enabled`,
      collectionIdOrAlias
    )
    return this.doPut(endpoint, enabled)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
