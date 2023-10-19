import { AxiosResponse } from 'axios';
import { DatasetLock } from '../../../domain/models/DatasetLock';

export const transformDatasetLocksResponseToDatasetLocks = (response: AxiosResponse): DatasetLock[] => {
  const datasetLocksPayload = response.data.data;
  // TODO
  console.log(datasetLocksPayload);
  return [];
};
