import { AxiosResponse } from 'axios'
import { DatasetType } from '../../models/DatasetType'
import { DatasetTypePayload } from './DatasetTypePayload'

export const transformPayloadToDatasetType = (response: AxiosResponse): DatasetType[] => {
  const payload = response.data.data as DatasetTypePayload[]

  return payload.map((datasetType: DatasetTypePayload) => ({
    id: datasetType.id,
    name: datasetType.name,
    linkedMetadataBlocks: datasetType.linkedMetadataBlocks,
    availableLicenses: datasetType.availableLicenses
  }))
}
