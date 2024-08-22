import { Collection, CollectionInputLevel } from '../../../domain/models/Collection'
import { AxiosResponse } from 'axios'
import { CollectionInputLevelPayload, CollectionPayload } from './CollectionPayload'
import { transformPayloadToOwnerNode } from '../../../../core/infra/repositories/transformers/dvObjectOwnerNodeTransformer'
import { transformHtmlToMarkdown } from '../../../../datasets/infra/repositories/transformers/datasetTransformers'
import { CollectionItemSubset } from '../../../domain/models/CollectionItemSubset'
import { DatasetPreview } from '../../../../datasets'
import { FilePreview } from '../../../../files'
import { DatasetPreviewPayload } from '../../../../datasets/infra/repositories/transformers/DatasetPreviewPayload'
import { FilePreviewPayload } from '../../../../files/infra/repositories/transformers/FilePreviewPayload'
import { transformDatasetPreviewPayloadToDatasetPreview } from '../../../../datasets/infra/repositories/transformers/datasetPreviewsTransformers'
import { transformFilePreviewPayloadToFilePreview } from '../../../../files/infra/repositories/transformers/filePreviewTransformers'

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
  return inputLevelsPayload.map((inputLevel) => ({
    datasetFieldName: inputLevel.datasetFieldTypeName,
    include: inputLevel.include,
    required: inputLevel.required
  }))
}

export const transformCollectionItemsResponseToCollectionItemSubset = (
  response: AxiosResponse
): CollectionItemSubset => {
  const responseDataPayload = response.data.data
  const itemsPayload = responseDataPayload.items
  const items: (DatasetPreview | FilePreview)[] = []
  itemsPayload.forEach(function (itemPayload: DatasetPreviewPayload | FilePreviewPayload) {
    if (itemPayload.type == 'file') {
      items.push(transformFilePreviewPayloadToFilePreview(itemPayload as FilePreviewPayload))
    } else if (itemPayload.type == 'dataset') {
      items.push(
        transformDatasetPreviewPayloadToDatasetPreview(itemPayload as DatasetPreviewPayload)
      )
    }
  })
  return {
    items: items,
    totalItemCount: responseDataPayload.total_count
  }
}
