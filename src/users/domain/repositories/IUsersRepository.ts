import { ApiTokenInfo } from '../models/ApiTokenInfo'
import { AuthenticatedUser } from '../models/AuthenticatedUser'

export interface IUsersRepository {
  getCurrentAuthenticatedUser(): Promise<AuthenticatedUser>
  recreateApiToken(): Promise<string>
  getCurrentApiToken(): Promise<ApiTokenInfo>
}
