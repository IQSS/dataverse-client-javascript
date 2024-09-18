import { ApiTokenInfo } from '../models/ApiTokenInfo'
import { AuthenticatedUser } from '../models/AuthenticatedUser'

export interface IUsersRepository {
  getCurrentAuthenticatedUser(): Promise<AuthenticatedUser>
  recreateApiToken(): Promise<ApiTokenInfo>
  getCurrentApiToken(): Promise<ApiTokenInfo>
  deleteCurrentApiToken(): Promise<void>
}
