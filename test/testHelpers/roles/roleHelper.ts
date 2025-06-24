import { Role } from '../../../src/roles/domain/models/Role'

export const createRoleModel = (): Role => {
  return {
    id: 1,
    name: 'admin',
    alias: 'Admin',
    description:
      'A person who has all permissions for dataverses, datasets, and files, including approving requests for restricted data.',
    permissions: [
      'AddDataverse',
      'AddDataset',
      'ViewUnpublishedDataverse',
      'ViewUnpublishedDataset'
    ]
  }
}
export const createRoleModelArray = (count: number): Role[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `role${index + 1}`,
    alias: `Role ${index + 1}`,
    description: `Description for role ${index + 1}`,
    permissions: [`Permission${index + 1}`]
  }))
}
