import { FileUserPermissions } from '../../../src/files/domain/models/FileUserPermissions';

export const createFileUserPermissionsModel = (): FileUserPermissions => {
  return {
    canDownloadFile: true,
    canManageFilePermissions: true,
    canEditOwnerDataset: true,
  };
};
