import { AxiosResponse } from 'axios'
import { CollectionUserPermissions } from '../../../domain/models/CollectionUserPermissions'

export const transformCollectionUserPermissionsResponseToCollectionUserPermissions = (
  response: AxiosResponse
): CollectionUserPermissions => {
  const collectionUserPermissionsPayload = response.data.data
  return {
    canAddCollection: collectionUserPermissionsPayload.canAddDataverse,
    canAddDataset: collectionUserPermissionsPayload.canAddDataset,
    canViewUnpublishedCollection: collectionUserPermissionsPayload.canViewUnpublishedDataverse,
    canEditCollection: collectionUserPermissionsPayload.canEditDataverse,
    canManageCollectionPermissions: collectionUserPermissionsPayload.canManageDataversePermissions,
    canPublishCollection: collectionUserPermissionsPayload.canPublishDataverse,
    canDeleteCollection: collectionUserPermissionsPayload.canDeleteDataverse
  }
}
