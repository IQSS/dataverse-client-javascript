import { Collection, CollectionInputLevel } from '../../../domain/models/Collection'
import { AxiosResponse } from 'axios'
import { CollectionInputLevelPayload, CollectionPayload } from './CollectionPayload'
import { transformPayloadToOwnerNode } from '../../../../core/infra/repositories/transformers/dvObjectOwnerNodeTransformer'
import { transformHtmlToMarkdown } from '../../../../datasets/infra/repositories/transformers/datasetTransformers'

export const transformCollectionResponseToCollection = (response: AxiosResponse): Collection => {
  const collectionPayload = response.data.data
  return transformPayloadToCollection(collectionPayload)
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
  let collectionInputLevels: CollectionInputLevel[] = []
  inputLevelsPayload.forEach((element) => {
    collectionInputLevels.push({
      datasetFieldName: element.datasetFieldTypeName,
      include: element.include,
      required: element.required
    })
  })
  return collectionInputLevels
}
