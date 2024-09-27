import { ApiTokenInfo } from '../models/ApiTokenInfo'
import { AuthenticatedUser } from '../models/AuthenticatedUser'

export interface IUsersRepository {
  getCurrentAuthenticatedUser(): Promise<AuthenticatedUser>
  recreateCurrentApiToken(): Promise<ApiTokenInfo>
  getCurrentApiToken(): Promise<ApiTokenInfo>
  deleteCurrentApiToken(): Promise<void>
}
