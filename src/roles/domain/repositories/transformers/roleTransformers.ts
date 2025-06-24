import { AxiosResponse } from 'axios'
import { Role } from '../../models/Role'

export const transformRolesUserSelectableResponseToRoles = (response: AxiosResponse): Role[] => {
  const roleUserSelectablePayload = response.data.data

  return roleUserSelectablePayload.map((role: any) => ({
    id: role.id,
    name: role.name,
    alias: role.alias,
    description: role.description,
    permissions: role.permissions
  }))
}
