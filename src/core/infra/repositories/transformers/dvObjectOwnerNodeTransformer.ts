import { OwnerNodePayload } from './OwnerNodePayload'
import { DvObjectOwnerNode, DvObjectType } from '../../../domain/models/DvObjectOwnerNode'

export const transformPayloadToOwnerNode = (
  ownerNodePayload: OwnerNodePayload
): DvObjectOwnerNode => {
  return {
    type: ownerNodePayload.type as DvObjectType,
    displayName: ownerNodePayload.displayName,
    identifier: ownerNodePayload.identifier,
    ...(ownerNodePayload.persistentIdentifier && {
      persistentIdentifier: ownerNodePayload.persistentIdentifier
    }),
    ...(ownerNodePayload.version && { version: ownerNodePayload.version }),
    ...(ownerNodePayload.isPartOf && {
      isPartOf: transformPayloadToOwnerNode(ownerNodePayload.isPartOf)
    })
  }
}
