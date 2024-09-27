import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IUsersRepository } from '../../domain/repositories/IUsersRepository'
import { AuthenticatedUser } from '../../domain/models/AuthenticatedUser'
import { AxiosResponse } from 'axios'
import { ApiTokenInfo } from '../../domain/models/ApiTokenInfo'
import {
  transformGetApiTokenResponseToApiTokenInfo,
  transformRecreateApiTokenResponseToApiTokenInfo
} from './transformers/apiTokenInfoTransformers'

export class UsersRepository extends ApiRepository implements IUsersRepository {
  private readonly usersResourceName: string = 'users'

  public async getCurrentAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.doGet(`/${this.usersResourceName}/:me`, true)
      .then((response) => this.getAuthenticatedUserFromResponse(response))
      .catch((error) => {
        throw error
      })
  }

  public async recreateCurrentApiToken(): Promise<ApiTokenInfo> {
    return this.doPost(`/${this.usersResourceName}/token/recreate?returnExpiration=true`, {})
      .then((response) => transformRecreateApiTokenResponseToApiTokenInfo(response))
      .catch((error) => {
        throw error
      })
  }

  public async getCurrentApiToken(): Promise<ApiTokenInfo> {
    return this.doGet(`/${this.usersResourceName}/token`, true)
      .then((response) => transformGetApiTokenResponseToApiTokenInfo(response))
      .catch((error) => {
        throw error
      })
  }

  public async deleteCurrentApiToken(): Promise<void> {
    return this.doDelete(`/${this.usersResourceName}/token`)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  private getAuthenticatedUserFromResponse(response: AxiosResponse): AuthenticatedUser {
    const responseData = response.data.data
    return {
      id: responseData.id,
      persistentUserId: responseData.persistentUserId,
      identifier: responseData.identifier,
      displayName: responseData.displayName,
      firstName: responseData.firstName,
      lastName: responseData.lastName,
      email: responseData.email,
      superuser: responseData.superuser,
      deactivated: responseData.deactivated,
      createdTime: responseData.createdTime,
      authenticationProviderId: responseData.authenticationProviderId,
      lastLoginTime: responseData.lastLoginTime,
      lastApiUseTime: responseData.lastApiUseTime,
      deactivatedTime: responseData.deactivatedTime,
      affiliation: responseData.affiliation,
      position: responseData.position,
      emailLastConfirmed: responseData.emailLastConfirmed
    }
  }
}
