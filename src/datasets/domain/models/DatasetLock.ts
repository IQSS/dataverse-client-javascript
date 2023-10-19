export interface DatasetLock {
  lockType: DatasetLockType;
  date?: string;
  userId: string;
  datasetId: string;
  message?: string;
}

export enum DatasetLockType {
  WORKFLOW = 'Workflow',
  IN_REVIEW = 'InReview',
  DCM_UPLOAD = 'DcmUpload',
  GLOBUS_UPLOAD = 'GlobusUpload',
  FINALIZE_PUBLICATION = 'finalizePublication',
  EDIT_IN_PROGRESS = 'EditInProgress',
  FILE_VALIDATION_FAILED = 'FileValidationFailed',
}
