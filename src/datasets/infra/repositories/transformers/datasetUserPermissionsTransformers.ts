import { AxiosResponse } from 'axios';
import { DatasetUserPermissions } from '../../../domain/models/DatasetUserPermissions';

export const transformDatasetUserPermissionsResponseToDatasetUserPermissions = (
  response: AxiosResponse,
): DatasetUserPermissions => {
  const datasetUserPermissionsPayload = response.data.data;
  return {
    canViewUnpublishedDataset: datasetUserPermissionsPayload.canViewUnpublishedDataset,
    canEditDataset: datasetUserPermissionsPayload.canEditDataset,
    canPublishDataset: datasetUserPermissionsPayload.canPublishDataset,
    canManageDatasetPermissions: datasetUserPermissionsPayload.canManageDatasetPermissions,
    canDeleteDatasetDraft: datasetUserPermissionsPayload.canDeleteDatasetDraft,
  };
};
