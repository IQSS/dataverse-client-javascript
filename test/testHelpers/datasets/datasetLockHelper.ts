import { DatasetLock, DatasetLockType } from '../../../src/datasets/domain/models/DatasetLock';

export const createDatasetLockModel = (): DatasetLock => {
  return {
    lockType: DatasetLockType.EDIT_IN_PROGRESS,
    date: '2023-05-15T08:21:03Z',
    userId: '1',
    datasetId: '2',
    message: 'Test.',
  };
};

export const createDatasetLockPayload = (): any => {
  return {
    lockType: DatasetLockType.EDIT_IN_PROGRESS.toString(),
    date: '2023-05-15T08:21:03Z',
    user: '1',
    dataset: '2',
    message: 'Test.',
  };
};
