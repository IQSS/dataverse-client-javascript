import { AxiosResponse } from 'axios'
import { Role } from '../../models/Role'

export const transformRolesUserSelectableResponseToRoles = (response: AxiosResponse): Role[] => {
  console.log('transformRolesUserSelectableResponseToRoles', response)
  const roleUserSelectablePayload = response.data.data
  console.log('transformRolesUserSelectableResponseToRoles', response.data.data)

  return roleUserSelectablePayload.map((role: any) => ({
    id: role.id,
    name: role.name,
    alias: role.alias,
    description: role.description,
    permissions: role.permissions
  }))
}
