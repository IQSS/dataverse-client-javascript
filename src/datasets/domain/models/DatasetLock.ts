export interface DatasetLock {
  lockType: DatasetLockType
  date?: string
  userId: string
  datasetPersistentId: string
  message?: string
}

export enum DatasetLockType {
  INGEST = 'Ingest',
  WORKFLOW = 'Workflow',
  IN_REVIEW = 'InReview',
  DCM_UPLOAD = 'DcmUpload',
  GLOBUS_UPLOAD = 'GlobusUpload',
  FINALIZE_PUBLICATION = 'finalizePublication',
  EDIT_IN_PROGRESS = 'EditInProgress',
  FILE_VALIDATION_FAILED = 'FileValidationFailed'
}
