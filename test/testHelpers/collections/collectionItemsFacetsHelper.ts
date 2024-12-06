import { CollectionItemsFacet } from '../../../src/collections/domain/models/CollectionItemSubset'
import { CollectionItemsFacetPayload } from '../../../src/collections/infra/repositories/transformers/CollectionItemsFacetsPayload'

export const createCollectionItemsFacetsModel = (): CollectionItemsFacet[] => {
  return [
    {
      facet1: {
        friendly: 'Facet 1',
        labels: [
          { name: 'Label 1', count: 5 },
          { name: 'Label 2', count: 4 }
        ]
      }
    },
    {
      facet2: {
        friendly: 'Facet 2',
        labels: [
          { name: 'Label 3', count: 8 },
          { name: 'Label 4', count: 9 }
        ]
      }
    }
  ]
}

export const createCollectionItemsFacetsPayload = (): CollectionItemsFacetPayload => {
  return [
    {
      facet1: {
        friendly: 'Facet 1',
        labels: [{ 'Label 1': 5 }, { 'Label 2': 4 }]
      },
      facet2: {
        friendly: 'Facet 2',
        labels: [{ 'Label 3': 8 }, { 'Label 4': 9 }]
      }
    }
  ]
}
