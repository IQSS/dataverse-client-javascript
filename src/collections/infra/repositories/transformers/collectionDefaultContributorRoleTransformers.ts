import { AxiosResponse } from 'axios'
import { Role } from '../../../../roles/domain/models/Role'

export const transformCollectionDefaultContributorRoleToRole = (
  response: AxiosResponse
): Role => {
  const defaultContributorRolePayload = response.data.data
  return {
    alias: defaultContributorRolePayload.alias,
    name: defaultContributorRolePayload.name,
    permissions: defaultContributorRolePayload.permissions,
    description: defaultContributorRolePayload.description,
    id: defaultContributorRolePayload.id
  }
}
