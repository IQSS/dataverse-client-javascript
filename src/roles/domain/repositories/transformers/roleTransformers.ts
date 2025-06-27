import { AxiosResponse } from 'axios'
import { Role } from '../../models/Role'
import { RolePayload } from './RolePayload'

export const transformRolesUserSelectableResponseToRoles = (response: AxiosResponse): Role[] => {
  const roleUserSelectablePayload = response.data.data as RolePayload[]

  return roleUserSelectablePayload.map((role: RolePayload) => ({
    id: role.id,
    name: role.name,
    alias: role.alias,
    description: role.description,
    permissions: role.permissions
  }))
}
