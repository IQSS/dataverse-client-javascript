import { UsersRepository } from './infra/repositories/UsersRepository'
import { GetCurrentAuthenticatedUser } from './domain/useCases/GetCurrentAuthenticatedUser'
import { RecreateApiToken } from './domain/useCases/RecreateApiToken'

const usersRepository = new UsersRepository()

const getCurrentAuthenticatedUser = new GetCurrentAuthenticatedUser(usersRepository)
const recreateApiToken = new RecreateApiToken(usersRepository)

export { getCurrentAuthenticatedUser, recreateApiToken }
export { AuthenticatedUser } from './domain/models/AuthenticatedUser'
