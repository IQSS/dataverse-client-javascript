import { UsersRepository } from './infra/repositories/UsersRepository'
import { GetCurrentAuthenticatedUser } from './domain/useCases/GetCurrentAuthenticatedUser'
import { RecreateCurrentApiToken } from './domain/useCases/RecreateCurrentApiToken'
import { GetCurrentApiToken } from './domain/useCases/GetCurrentApiToken'
import { DeleteCurrentApiToken } from './domain/useCases/DeleteCurrentApiToken'
import { RegisterUser } from './domain/useCases/RegisterUser'
import { SignUp } from './domain/useCases/SignUp'
import { GetOrcidSignUpAuthorizationUrl } from './domain/useCases/GetOrcidSignUpAuthorizationUrl'
import { ConnectOrcidForSignUp } from './domain/useCases/ConnectOrcidForSignUp'

const usersRepository = new UsersRepository()

const getCurrentAuthenticatedUser = new GetCurrentAuthenticatedUser(usersRepository)
const recreateCurrentApiToken = new RecreateCurrentApiToken(usersRepository)
const getCurrentApiToken = new GetCurrentApiToken(usersRepository)
const deleteCurrentApiToken = new DeleteCurrentApiToken(usersRepository)
const registerUser = new RegisterUser(usersRepository)
const signUp = new SignUp(usersRepository)
const getOrcidSignUpAuthorizationUrl = new GetOrcidSignUpAuthorizationUrl(usersRepository)
const connectOrcidForSignUp = new ConnectOrcidForSignUp(usersRepository)

export {
  getCurrentAuthenticatedUser,
  recreateCurrentApiToken,
  getCurrentApiToken,
  deleteCurrentApiToken,
  registerUser,
  signUp,
  getOrcidSignUpAuthorizationUrl,
  connectOrcidForSignUp
}
export { AuthenticatedUser } from './domain/models/AuthenticatedUser'
export { ApiTokenInfo } from './domain/models/ApiTokenInfo'
export { UserDTO } from './domain/dtos/UserDTO'
export { SignUpDTO } from './domain/dtos/SignUpDTO'
export { OrcidSignUpCallbackDTO } from './domain/dtos/OrcidSignUpCallbackDTO'
export {
  SignUpResult,
  SignUpCreatedResult,
  SignUpPendingResult
} from './domain/models/SignUpResult'
export { OrcidSignUpConnection } from './domain/models/OrcidSignUpConnection'
