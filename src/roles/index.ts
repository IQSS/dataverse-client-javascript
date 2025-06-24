import { RolesRepository } from './infra/repositories/RolesRepository'
import { GetUserSelectableRoles } from './domain/useCases/GetUserSelectableRoles'

const rolesRepository = new RolesRepository()

const getCurrentAuthenticatedUser = new GetUserSelectableRoles(rolesRepository)

export { getCurrentAuthenticatedUser }

export { Role } from './domain/models/Role'
