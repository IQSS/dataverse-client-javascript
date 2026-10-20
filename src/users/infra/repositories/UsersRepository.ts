import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IUsersRepository } from '../../domain/repositories/IUsersRepository'
import { AuthenticatedUser } from '../../domain/models/AuthenticatedUser'
import { AxiosResponse } from 'axios'
import { ApiTokenInfo } from '../../domain/models/ApiTokenInfo'
import {
  transformGetApiTokenResponseToApiTokenInfo,
  transformRecreateApiTokenResponseToApiTokenInfo
} from './transformers/apiTokenInfoTransformers'
import { UserDTO } from '../../domain/dtos/UserDTO'
import { SignUpDTO } from '../../domain/dtos/SignUpDTO'
import { OrcidSignUpCallbackDTO } from '../../domain/dtos/OrcidSignUpCallbackDTO'
import { SignUpResult } from '../../domain/models/SignUpResult'
import { OrcidSignUpConnection } from '../../domain/models/OrcidSignUpConnection'
import { ApiConstants } from '../../../core/infra/repositories/ApiConstants'
import { transformOrcidSignUpConnectionResponseToOrcidSignUpConnection } from './transformers/orcidSignUpConnectionTransformers'

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

  public async registerUser(userDTO: UserDTO): Promise<void> {
    return this.doPost(`/${this.usersResourceName}/register`, userDTO)
      .then(() => undefined)
      .catch((error) => {
        throw error
      })
  }

  public async signUp(signUpDTO: SignUpDTO): Promise<SignUpResult> {
    return this.doPost(
      `/${this.usersResourceName}/signup`,
      signUpDTO,
      {},
      ApiConstants.CONTENT_TYPE_APPLICATION_JSON,
      false
    )
      .then((response): SignUpResult => {
        if (response.status === 202) {
          return { status: 'pending' }
        }
        return { status: 'created', identifier: response.data.data.identifier }
      })
      .catch((error) => {
        throw error
      })
  }

  public async getOrcidSignUpAuthorizationUrl(redirectUri: string): Promise<string> {
    return this.doGet(`/${this.usersResourceName}/signup/orcid/authorize`, false, { redirectUri })
      .then((response) => response.data.data.authorizationUrl)
      .catch((error) => {
        throw error
      })
  }

  public async connectOrcidForSignUp(
    callback: OrcidSignUpCallbackDTO
  ): Promise<OrcidSignUpConnection> {
    return this.doPost(
      `/${this.usersResourceName}/signup/orcid`,
      callback,
      {},
      ApiConstants.CONTENT_TYPE_APPLICATION_JSON,
      false
    )
      .then((response) => transformOrcidSignUpConnectionResponseToOrcidSignUpConnection(response))
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
      emailLastConfirmed: responseData.emailLastConfirmed,
      authenticatedOrcid: responseData.authenticatedOrcid
    }
  }
}
