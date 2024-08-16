import { CollectionUserPermissions } from '../../../src/collections/domain/models/CollectionUserPermissions'
import { CollectionUserPermissionsPayload } from '../../../src/collections/infra/repositories/transformers/CollectionUserPermissionsPayload'

export const createCollectionUserPermissionsModel = (): CollectionUserPermissions => {
  return {
    canAddCollection: true,
    canAddDataset: true,
    canViewUnpublishedCollection: true,
    canEditCollection: true,
    canManageCollectionPermissions: true,
    canPublishCollection: true,
    canDeleteCollection: true
  }
}

export const createCollectionUserPermissionsPayload = (): CollectionUserPermissionsPayload => {
  return {
    canAddDataverse: true,
    canAddDataset: true,
    canViewUnpublishedDataverse: true,
    canEditDataverse: true,
    canManageDataversePermissions: true,
    canPublishDataverse: true,
    canDeleteDataverse: true
  }
}
