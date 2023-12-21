import { DatasetLock, DatasetLockType } from '../../../src/datasets/domain/models/DatasetLock';
import { DatasetLockPayload } from '../../../src/datasets/infra/repositories/transformers/datasetLocksTransformers';

export const createDatasetLockModel = (): DatasetLock => {
  return {
    lockType: DatasetLockType.EDIT_IN_PROGRESS,
    date: '2023-05-15T08:21:03Z',
    userId: '1',
    datasetPersistentId: 'doi:10.5072/FK2/QYOVTJ',
    message: 'Test.',
  };
};

export const createDatasetLockPayload = (): DatasetLockPayload => {
  return {
    lockType: DatasetLockType.EDIT_IN_PROGRESS.toString(),
    date: '2023-05-15T08:21:03Z',
    user: '1',
    dataset: 'doi:10.5072/FK2/QYOVTJ',
    message: 'Test.',
  };
};
