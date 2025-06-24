import { Role } from '../models/Role'

export interface IRolesRepository {
  getUserSelectableRoles(): Promise<Role[]>
}
