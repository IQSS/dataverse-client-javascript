import { RolesRepository } from './infra/repositories/RolesRepository'
import { GetUserSelectableRoles } from './domain/useCases/GetUserSelectableRoles'

const rolesRepository = new RolesRepository()

const getUserSelectableRoles = new GetUserSelectableRoles(rolesRepository)

export { getUserSelectableRoles }

export { Role } from './domain/models/Role'
export { RoleAlias } from './domain/models/RoleAlias'