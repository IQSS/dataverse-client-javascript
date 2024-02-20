export interface OwnerPayload {
  type: string;
  identifier: string;
  displayName: string;
  owner?: OwnerPayload;
}
