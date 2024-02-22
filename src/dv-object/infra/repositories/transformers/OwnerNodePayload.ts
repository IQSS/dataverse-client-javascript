export interface OwnerNodePayload {
  type: string;
  identifier: string;
  displayName: string;
  isPartOf?: OwnerNodePayload;
}
