import { UsersRepository } from './infra/repositories/UsersRepository'
import { GetCurrentAuthenticatedUser } from './domain/useCases/GetCurrentAuthenticatedUser'
import { RecreateApiToken } from './domain/useCases/RecreateApiToken'
import { GetCurrentApiToken } from './domain/useCases/GetCurrentApiToken'

const usersRepository = new UsersRepository()

const getCurrentAuthenticatedUser = new GetCurrentAuthenticatedUser(usersRepository)
const recreateApiToken = new RecreateApiToken(usersRepository)
const getCurrentApiToken = new GetCurrentApiToken(usersRepository)

export { getCurrentAuthenticatedUser, recreateApiToken, getCurrentApiToken }
export { AuthenticatedUser } from './domain/models/AuthenticatedUser'
