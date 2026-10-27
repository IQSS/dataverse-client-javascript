import { ApiTokenInfo } from '../models/ApiTokenInfo'
import { AuthenticatedUser } from '../models/AuthenticatedUser'
import { UserDTO } from '../dtos/UserDTO'

export interface IUsersRepository {
  getCurrentAuthenticatedUser(): Promise<AuthenticatedUser>
  recreateCurrentApiToken(): Promise<ApiTokenInfo>
  getCurrentApiToken(): Promise<ApiTokenInfo>
  deleteCurrentApiToken(): Promise<void>
  registerUser(userDTO: UserDTO): Promise<void>
}
