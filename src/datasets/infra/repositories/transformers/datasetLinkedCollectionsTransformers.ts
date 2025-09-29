import { DatasetLinkedCollection } from '../../../domain/models/DatasetLinkedCollection'
import { DatasetLinkedCollectionsPayload } from './DatasetLinkedCollectionsPayload'

export const transformDatasetLinkedCollectionsResponseToDatasetLinkedCollection = (
  payload: DatasetLinkedCollectionsPayload
): DatasetLinkedCollection[] => {
  return payload['linked-dataverses'].map((linkedDataverse) => ({
    id: linkedDataverse.id,
    alias: linkedDataverse.alias,
    displayName: linkedDataverse.displayName
  }))
}
