import { OwnerNodePayload } from './OwnerNodePayload';
import { DvObjectOwnerNode, DvObjectType } from '../../../domain/models/DvObjectOwnerNode';

export const transformPayloadToOwnerNode = (ownerNodePayload: OwnerNodePayload): DvObjectOwnerNode => {
  return {
    type: ownerNodePayload.type as DvObjectType,
    identifier: ownerNodePayload.identifier,
    displayName: ownerNodePayload.displayName,
    ...(ownerNodePayload.isPartOf && { isPartOf: transformPayloadToOwnerNode(ownerNodePayload.isPartOf) }),
  };
};
