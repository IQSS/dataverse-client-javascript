import { Collection, CollectionContacts } from "../../../domain/models/Collection";
import { AxiosResponse } from 'axios';
import { CollectionPayload, CollectionContactsPayload } from "./CollectionPayload";

export const transformCollectionIdResponseToPayload = (response: AxiosResponse): Collection => {
  const collectionPayload = response.data
  return transformPayloadToCollection(collectionPayload)
}

const transformPayloadToCollection = (collectionPayload: CollectionPayload):Collection {
  const collectionModel: Collection = {
    id: collectionPayload.id,
    alias: collectionPayload.alias,
    name: collectionPayload.name,
    affiliation: collectionPayload.affiliation,
    collectionContacts: transformPayloadToCollectionContacts(collectionPayload.dataverseContacts),
    permissionRoot: collectionPayload.permissionRoot,
    description: collectionPayload.description,
    collectionType: collectionPayload.dataverseType,
    ownerId: collectionPayload.ownerId,
    creationDate: collectionPayload.creationDate
  }
  return collectionModel
}

const transformPayloadToCollectionContacts = (collectionContactsPayload: CollectionContactsPayload): CollectionContacts => {
  const collectionContacts: CollectionContacts = {
    displayOrder: collectionContactsPayload.displayOrder,
    contactEmail: collectionContactsPayload.contactEmail
  }
  return collectionContacts
}

//