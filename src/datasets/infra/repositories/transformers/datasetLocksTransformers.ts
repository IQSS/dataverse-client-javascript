import { AxiosResponse } from 'axios';
import { DatasetLock, DatasetLockType } from '../../../domain/models/DatasetLock';

export const transformDatasetLocksResponseToDatasetLocks = (response: AxiosResponse): DatasetLock[] => {
  const datasetLocks: DatasetLock[] = [];
  const datasetLocksPayload = response.data.data;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  datasetLocksPayload.forEach(function (datasetLockPayload: any) {
    datasetLocks.push(transformDatasetLockPayloadToDatasetLock(datasetLockPayload));
  });
  return datasetLocks;
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformDatasetLockPayloadToDatasetLock = (datasetLockPayload: any): DatasetLock => {
  return {
    lockType: datasetLockPayload.lockType as DatasetLockType,
    ...(datasetLockPayload.date && { date: datasetLockPayload.date }),
    userId: datasetLockPayload.user,
    datasetPersistentId: datasetLockPayload.dataset,
    ...(datasetLockPayload.message && { message: datasetLockPayload.message }),
  };
};
