import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { CreateGuestbookDTO } from '../../domain/dtos/CreateGuestbookDTO'
import { Guestbook } from '../../domain/models/Guestbook'
import { IGuestbooksRepository } from '../../domain/repositories/IGuestbooksRepository'

export class GuestbooksRepository extends ApiRepository implements IGuestbooksRepository {
  private readonly guestbooksResourceName: string = 'guestbooks'
  private readonly datasetsResourceName: string = 'datasets'

  public async createGuestbook(
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ): Promise<number> {
    return this.doPost(
      this.buildApiEndpoint(this.guestbooksResourceName, `${collectionIdOrAlias}`),
      guestbook
    )
      .then((response) => response.data.data.id)
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

  public async getGuestbooksByCollectionId(
    collectionIdOrAlias: number | string,
    includeStats = false
  ): Promise<Guestbook[]> {
    return this.doGet(
      this.buildApiEndpoint(this.guestbooksResourceName, `${collectionIdOrAlias}/list`),
      true,
      includeStats ? { includeStats } : {}
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
      `${collectionIdOrAlias}/${guestbookId}/enabled`
    )
    return this.doPut(endpoint, enabled)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async assignDatasetGuestbook(
    datasetId: number | string,
    guestbookId: number
  ): Promise<void> {
    const endpoint = this.buildApiEndpoint(this.datasetsResourceName, 'guestbook', datasetId)
    return this.doPut(endpoint, guestbookId.toString())
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async removeDatasetGuestbook(datasetId: number | string): Promise<void> {
    const endpoint = this.buildApiEndpoint(this.datasetsResourceName, 'guestbook', datasetId)
    return this.doDelete(endpoint)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }
}
