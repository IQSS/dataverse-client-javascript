import { AxiosResponse } from 'axios'
import { DatasetLock, DatasetLockType } from '../../../domain/models/DatasetLock'

export interface DatasetLockPayload {
  lockType: string
  date?: string
  user: string
  dataset: string
  message?: string
}

export const transformDatasetLocksResponseToDatasetLocks = (
  response: AxiosResponse
): DatasetLock[] => {
  const datasetLocks: DatasetLock[] = []
  const datasetLocksPayload = response.data.data
  datasetLocksPayload.forEach(function (datasetLockPayload: DatasetLockPayload) {
    datasetLocks.push(transformDatasetLockPayloadToDatasetLock(datasetLockPayload))
  })
  return datasetLocks
}

const transformDatasetLockPayloadToDatasetLock = (
  datasetLockPayload: DatasetLockPayload
): DatasetLock => {
  return {
    lockType: datasetLockPayload.lockType as DatasetLockType,
    ...(datasetLockPayload.date && { date: datasetLockPayload.date }),
    userId: datasetLockPayload.user,
    datasetPersistentId: datasetLockPayload.dataset,
    ...(datasetLockPayload.message && { message: datasetLockPayload.message })
  }
}
