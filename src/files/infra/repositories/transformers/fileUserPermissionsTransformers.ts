import { AxiosResponse } from 'axios';
import { FileUserPermissions } from '../../../domain/models/FileUserPermissions';

export const transformFileUserPermissionsResponseToFileUserPermissions = (
  response: AxiosResponse,
): FileUserPermissions => {
  const fileUserPermissionsPayload = response.data.data;
  return {
    canDownloadFile: fileUserPermissionsPayload.canDownloadFile,
    canEditOwnerDataset: fileUserPermissionsPayload.canEditOwnerDataset,
  };
};
