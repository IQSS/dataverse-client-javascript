import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { CreateGuestbookDTO } from '../../domain/dtos/CreateGuestbookDTO'
import { EditGuestbookDTO } from '../../domain/dtos/EditGuestbookDTO'
import { GuestbookResponsesDTO } from '../../domain/dtos/GuestbookResponsesDTO'
import { Guestbook } from '../../domain/models/Guestbook'
import { GuestbookResponseSubset } from '../../domain/models/GuestbookResponse'
import { IGuestbooksRepository } from '../../domain/repositories/IGuestbooksRepository'

export class GuestbooksRepository extends ApiRepository implements IGuestbooksRepository {
  private readonly guestbooksResourceName: string = 'guestbooks'
  private readonly datasetsResourceName: string = 'datasets'
  private readonly dataversesResourceName: string = 'dataverses'

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

  public async editGuestbook(guestbookId: number, guestbook: EditGuestbookDTO): Promise<void> {
    return this.doPut(
      this.buildApiEndpoint(this.guestbooksResourceName, undefined, guestbookId),
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

  public async getGuestbooksByCollectionId(
    collectionIdOrAlias: number | string,
    includeStats = false,
    includeInherited = false
  ): Promise<Guestbook[]> {
    const queryParams = {
      ...(includeStats ? { includeStats } : {}),
      ...(includeInherited ? { includeInherited } : {})
    }

    return this.doGet(
      this.buildApiEndpoint(this.guestbooksResourceName, `${collectionIdOrAlias}/list`),
      true,
      queryParams
    )
      .then((response) => response.data.data as Guestbook[])
      .catch((error) => {
        throw error
      })
  }

  public async getGuestbookResponsesByGuestbookId(
    guestbookId: number,
    limit = 10,
    offset = 0
  ): Promise<GuestbookResponseSubset> {
    return this.doGet(
      this.buildApiEndpoint(this.guestbooksResourceName, 'responses', guestbookId),
      true,
      { limit, offset }
    )
      .then((response) => {
        const responseData = response.data.data as GuestbookResponsesDTO

        return {
          guestbookResponses: responseData.responses,
          totalGuestbookResponseCount: responseData.pagination?.totalResponses ?? 0
        }
      })
      .catch((error) => {
        throw error
      })
  }

  public async downloadGuestbookResponsesByCollectionId(
    collectionIdOrAlias: number | string,
    guestbookId?: number
  ): Promise<string> {
    const endpoint = this.buildApiEndpoint(
      this.dataversesResourceName,
      `${collectionIdOrAlias}/guestbookResponses`
    )

    return this.doGet(endpoint, true, guestbookId ? { guestbookId } : {})
      .then((response) => response.data as string)
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
