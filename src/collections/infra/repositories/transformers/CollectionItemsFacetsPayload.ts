export type CollectionItemsFacetPayload = [Record<string, CollectionItemsFacetPayloadValue>]

export interface CollectionItemsFacetPayloadValue {
  friendly: string
  labels: Record<string, number>[]
}
