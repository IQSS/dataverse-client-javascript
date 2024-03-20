// import { OwnerNodePayload } from '../../../../core/infra/repositories/transformers/OwnerNodePayload'
export interface CollectionPayload {
  id: number
  alias: string
  name: string
  affiliation: string
  description: string
  // isPartOf: OwnerNodePayload
}
