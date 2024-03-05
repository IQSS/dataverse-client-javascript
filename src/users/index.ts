import { UsersRepository } from './infra/repositories/UsersRepository'
import { GetCurrentAuthenticatedUser } from './domain/useCases/GetCurrentAuthenticatedUser'

const getCurrentAuthenticatedUser = new GetCurrentAuthenticatedUser(new UsersRepository())

export { getCurrentAuthenticatedUser }
export { AuthenticatedUser } from './domain/models/AuthenticatedUser'
