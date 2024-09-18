import { UsersRepository } from './infra/repositories/UsersRepository'
import { GetCurrentAuthenticatedUser } from './domain/useCases/GetCurrentAuthenticatedUser'
import { RecreateApiToken } from './domain/useCases/RecreateApiToken'
import { GetCurrentApiToken } from './domain/useCases/GetCurrentApiToken'
import { DeleteCurrentApiToken } from './domain/useCases/DeleteCurrentApiToken'

const usersRepository = new UsersRepository()

const getCurrentAuthenticatedUser = new GetCurrentAuthenticatedUser(usersRepository)
const recreateApiToken = new RecreateApiToken(usersRepository)
const getCurrentApiToken = new GetCurrentApiToken(usersRepository)
const deleteCurrentApiToken = new DeleteCurrentApiToken(usersRepository)

export { getCurrentAuthenticatedUser, recreateApiToken, getCurrentApiToken, deleteCurrentApiToken }
export { AuthenticatedUser } from './domain/models/AuthenticatedUser'
export { ApiTokenInfo } from './domain/models/ApiTokenInfo'
