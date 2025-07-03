import { DatasetUserPermissions } from '../../../src/datasets/domain/models/DatasetUserPermissions'

export const createDatasetUserPermissionsModel = (): DatasetUserPermissions => {
  return {
    canViewUnpublishedDataset: true,
    canEditDataset: true,
    canPublishDataset: true,
    canManageDatasetPermissions: true,
    canDeleteDatasetDraft: true
  }
}
