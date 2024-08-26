import { Collection, CollectionInputLevel } from '../../../domain/models/Collection'
import { AxiosResponse } from 'axios'
import { CollectionInputLevelPayload, CollectionPayload } from './CollectionPayload'
import { transformPayloadToOwnerNode } from '../../../../core/infra/repositories/transformers/dvObjectOwnerNodeTransformer'
import { transformHtmlToMarkdown } from '../../../../datasets/infra/repositories/transformers/datasetTransformers'
import { CollectionFacet } from '../../../domain/models/CollectionFacet'
import { CollectionFacetPayload } from './CollectionFacetPayload'

export const transformCollectionResponseToCollection = (response: AxiosResponse): Collection => {
  const collectionPayload = response.data.data
  return transformPayloadToCollection(collectionPayload)
}

export const transformCollectionFacetsResponseToCollectionFacets = (
  response: AxiosResponse
): CollectionFacet[] => {
  const facetsPayloads = response.data.data
  return facetsPayloads.map((facetsPayload: CollectionFacetPayload) => ({
    id: Number(facetsPayload.id),
    name: facetsPayload.name,
    displayName: facetsPayload.displayName
  }))
}

const transformPayloadToCollection = (collectionPayload: CollectionPayload): Collection => {
  const collectionModel: Collection = {
    id: collectionPayload.id,
    alias: collectionPayload.alias,
    name: collectionPayload.name,
    isReleased: collectionPayload.isReleased,
    affiliation: collectionPayload.affiliation,
    ...(collectionPayload.description && {
      description: transformHtmlToMarkdown(collectionPayload.description)
    }),
    ...(collectionPayload.isPartOf && {
      isPartOf: transformPayloadToOwnerNode(collectionPayload.isPartOf)
    }),
    ...(collectionPayload.inputLevels && {
      inputLevels: transformInputLevelsPayloadToInputLevels(collectionPayload.inputLevels)
    })
  }
  return collectionModel
}

const transformInputLevelsPayloadToInputLevels = (
  inputLevelsPayload: CollectionInputLevelPayload[]
): CollectionInputLevel[] => {
  return inputLevelsPayload.map((inputLevel) => ({
    datasetFieldName: inputLevel.datasetFieldTypeName,
    include: inputLevel.include,
    required: inputLevel.required
  }))
}
