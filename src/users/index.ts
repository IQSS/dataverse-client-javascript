import { UsersRepository } from './infra/repositories/UsersRepository'
import { GetCurrentAuthenticatedUser } from './domain/useCases/GetCurrentAuthenticatedUser'
import { RecreateCurrentApiToken } from './domain/useCases/RecreateCurrentApiToken'
import { GetCurrentApiToken } from './domain/useCases/GetCurrentApiToken'
import { DeleteCurrentApiToken } from './domain/useCases/DeleteCurrentApiToken'
import { RegisterUser } from './domain/useCases/RegisterUser'

const usersRepository = new UsersRepository()

const getCurrentAuthenticatedUser = new GetCurrentAuthenticatedUser(usersRepository)
const recreateCurrentApiToken = new RecreateCurrentApiToken(usersRepository)
const getCurrentApiToken = new GetCurrentApiToken(usersRepository)
const deleteCurrentApiToken = new DeleteCurrentApiToken(usersRepository)
const registerUser = new RegisterUser(usersRepository)

export {
  getCurrentAuthenticatedUser,
  recreateCurrentApiToken,
  getCurrentApiToken,
  deleteCurrentApiToken,
  registerUser
}
export { AuthenticatedUser } from './domain/models/AuthenticatedUser'
export { ApiTokenInfo } from './domain/models/ApiTokenInfo'
export { UserDTO } from './domain/dtos/UserDTO'
