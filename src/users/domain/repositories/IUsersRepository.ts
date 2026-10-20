import { ApiTokenInfo } from '../models/ApiTokenInfo'
import { AuthenticatedUser } from '../models/AuthenticatedUser'
import { UserDTO } from '../dtos/UserDTO'
import { SignUpDTO } from '../dtos/SignUpDTO'
import { OrcidSignUpCallbackDTO } from '../dtos/OrcidSignUpCallbackDTO'
import { SignUpResult } from '../models/SignUpResult'
import { OrcidSignUpConnection } from '../models/OrcidSignUpConnection'

export interface IUsersRepository {
  getCurrentAuthenticatedUser(): Promise<AuthenticatedUser>
  recreateCurrentApiToken(): Promise<ApiTokenInfo>
  getCurrentApiToken(): Promise<ApiTokenInfo>
  deleteCurrentApiToken(): Promise<void>
  registerUser(userDTO: UserDTO): Promise<void>
  signUp(signUpDTO: SignUpDTO): Promise<SignUpResult>
  getOrcidSignUpAuthorizationUrl(redirectUri: string): Promise<string>
  connectOrcidForSignUp(callback: OrcidSignUpCallbackDTO): Promise<OrcidSignUpConnection>
}
