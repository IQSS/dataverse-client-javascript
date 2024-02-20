import { OwnerPayload } from '../../../../dv-object/infra/repositories/transformers/OwnerPayload';
import { DvObjectOwner, DvObjectType } from '../../../domain/models/DvObjectOwner';

export const transformOwnerPayloadToOwner = (ownerPayload: OwnerPayload): DvObjectOwner => {
  return {
    type: ownerPayload.type as DvObjectType,
    identifier: ownerPayload.identifier,
    displayName: ownerPayload.displayName,
    ...(ownerPayload.owner && { owner: transformOwnerPayloadToOwner(ownerPayload.owner) }),
  };
};
