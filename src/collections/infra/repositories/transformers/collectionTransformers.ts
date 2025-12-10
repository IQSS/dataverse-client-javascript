import { Collection, CollectionInputLevel } from '../../../domain/models/Collection'
import { AxiosResponse } from 'axios'
import {
  CollectionContactPayload,
  CollectionInputLevelPayload,
  CollectionPayload,
} from './CollectionPayload'
import { transformPayloadToOwnerNode } from '../../../../core/infra/repositories/transformers/dvObjectOwnerNodeTransformer'
import { CollectionFacet } from '../../../domain/models/CollectionFacet'
import { CollectionFacetPayload } from './CollectionFacetPayload'
import {
  CollectionItemsFacet,
  CollectionItemSubset,
  CountPerObjectType
} from '../../../domain/models/CollectionItemSubset'
import { DatasetPreview } from '../../../../datasets'
import { FilePreview } from '../../../../files'
import { DatasetPreviewPayload } from '../../../../datasets/infra/repositories/transformers/DatasetPreviewPayload'
import { FilePreviewPayload } from '../../../../files/infra/repositories/transformers/FilePreviewPayload'
import {
  transformDatasetPreviewPayloadToDatasetPreview,
  transformMyDataDatasetPreviewPayloadToDatasetPreview
} from '../../../../datasets/infra/repositories/transformers/datasetPreviewsTransformers'
import {
  transformFilePreviewPayloadToFilePreview,
  transformMyDataFilePreviewPayloadToFilePreview
} from '../../../../files/infra/repositories/transformers/filePreviewTransformers'
import {
  transformCollectionPreviewPayloadToCollectionPreview,
  transformMyDataCollectionPreviewPayloadToCollectionPreview
} from './collectionPreviewsTransformers'
import { CollectionPreviewPayload } from './CollectionPreviewPayload'
import { CollectionPreview } from '../../../domain/models/CollectionPreview'
import { CollectionContact } from '../../../domain/models/CollectionContact'
import { CollectionType } from '../../../domain/models/CollectionType'
import { CollectionItemsFacetPayload } from './CollectionItemsFacetsPayload'
import { CollectionItemsCountPerObjectTypePayload } from './CollectionItemsCountPerObjectTypePayload'
import { MyDataFilePreviewPayload } from '../../../../files/infra/repositories/transformers/MyDataFilePreviewPayload'
import { MyDataDatasetPreviewPayload } from '../../../../datasets/infra/repositories/transformers/MyDataDatasetPreviewPayload'
import { MyDataCollectionPreviewPayload } from './MyDataCollectionPreviewPayload'
import { MyDataCountPerObjectTypePayload } from './MyDataCountPerObjectTypePayload'
import {
  MyDataCollectionItemSubset,
  PublicationStatusCount
} from '../../../domain/models/MyDataCollectionItemSubset'
import { PublicationStatus } from '../../../../core/domain/models/PublicationStatus'
import { CollectionLinks } from '../../../domain/models/CollectionLinks'

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
    type: collectionPayload.dataverseType as CollectionType,
    isMetadataBlockRoot: collectionPayload.isMetadataBlockRoot,
    isFacetRoot: collectionPayload.isFacetRoot,
    description: collectionPayload.description,
    childCount: collectionPayload.childCount,
    ...(collectionPayload.theme && {
      theme: collectionPayload.theme
    }),
    ...(collectionPayload.isPartOf && {
      isPartOf: transformPayloadToOwnerNode(collectionPayload.isPartOf)
    }),
    ...(collectionPayload.inputLevels && {
      inputLevels: transformInputLevelsPayloadToInputLevels(collectionPayload.inputLevels)
    }),
    ...(collectionPayload.dataverseContacts && {
      contacts: transformContactsPayloadToContacts(collectionPayload.dataverseContacts)
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
  const facetsPayload = responseDataPayload.facets as CollectionItemsFacetPayload
  const countPerObjectTypePayload = responseDataPayload['total_count_per_object_type'] as
    | CollectionItemsCountPerObjectTypePayload
    | undefined

  const items: (DatasetPreview | FilePreview | CollectionPreview)[] = []

  itemsPayload.forEach(function (
    itemPayload: CollectionPreviewPayload | DatasetPreviewPayload | FilePreviewPayload
  ) {
    if (itemPayload.type === 'file') {
      items.push(transformFilePreviewPayloadToFilePreview(itemPayload as FilePreviewPayload))
    } else if (itemPayload.type === 'dataset') {
      items.push(
        transformDatasetPreviewPayloadToDatasetPreview(itemPayload as DatasetPreviewPayload)
      )
    } else if (itemPayload.type === 'dataverse') {
      items.push(
        transformCollectionPreviewPayloadToCollectionPreview(
          itemPayload as unknown as CollectionPreviewPayload
        )
      )
    }
  })

  const facets: CollectionItemsFacet[] = Object.entries(facetsPayload[0]).map(
    ([key, facetData]) => ({
      name: key,
      friendlyName: facetData.friendly,
      labels: facetData.labels.map((label: Record<string, number>) => {
        const [name, count] = Object.entries(label)[0]
        return { name, count }
      })
    })
  )

  const countPerObjectType: CountPerObjectType | undefined = countPerObjectTypePayload
    ? {
        collections: countPerObjectTypePayload['Dataverses'],
        datasets: countPerObjectTypePayload['Datasets'],
        files: countPerObjectTypePayload['Files']
      }
    : undefined

  return {
    items,
    facets,
    totalItemCount: responseDataPayload.total_count,
    ...(countPerObjectType && { countPerObjectType })
  }
}
export const transformCollectionLinksResponseToCollectionLinks = (
  response: AxiosResponse
): CollectionLinks => {
  const responseDataPayload = response.data.data
  const linkedCollections = responseDataPayload.linkedDataverses
  const collectionsLinkingToThis = responseDataPayload.dataversesLinkingToThis
  const linkedDatasets = responseDataPayload.linkedDatasets.map(
    (ld: { identifier: string; title: string }) => ({
      persistentId: ld.identifier,
      title: ld.title
    })
  )

  return {
    linkedCollections,
    collectionsLinkingToThis,
    linkedDatasets
  }
}
export const transformMyDataResponseToCollectionItemSubset = (
  response: AxiosResponse
): MyDataCollectionItemSubset => {
  const responseDataPayload = response.data.data
  const itemsPayload = responseDataPayload.items
  const countPerObjectTypePayload = responseDataPayload[
    'dvobject_counts'
  ] as MyDataCountPerObjectTypePayload

  const items: (DatasetPreview | FilePreview | CollectionPreview)[] = []

  itemsPayload.forEach(function (
    itemPayload:
      | MyDataCollectionPreviewPayload
      | MyDataDatasetPreviewPayload
      | MyDataFilePreviewPayload
  ) {
    if (itemPayload.type === 'file') {
      items.push(
        transformMyDataFilePreviewPayloadToFilePreview(itemPayload as MyDataFilePreviewPayload)
      )
    } else if (itemPayload.type === 'dataset') {
      items.push(
        transformMyDataDatasetPreviewPayloadToDatasetPreview(
          itemPayload as MyDataDatasetPreviewPayload
        )
      )
    } else if (itemPayload.type === 'dataverse') {
      items.push(
        transformMyDataCollectionPreviewPayloadToCollectionPreview(
          itemPayload as unknown as MyDataCollectionPreviewPayload
        )
      )
    }
  })

  const countPerObjectType = {
    collections: countPerObjectTypePayload['dataverses_count'],
    datasets: countPerObjectTypePayload['datasets_count'],
    files: countPerObjectTypePayload['files_count']
  }

  const publicationStatusCounts: PublicationStatusCount[] = [
    {
      publicationStatus: PublicationStatus.Published,
      count: responseDataPayload.pubstatus_counts.published_count
    },
    {
      publicationStatus: PublicationStatus.Unpublished,
      count: responseDataPayload.pubstatus_counts.unpublished_count
    },
    {
      publicationStatus: PublicationStatus.Draft,
      count: responseDataPayload.pubstatus_counts.draft_count
    },
    {
      publicationStatus: PublicationStatus.InReview,
      count: responseDataPayload.pubstatus_counts.in_review_count
    },
    {
      publicationStatus: PublicationStatus.Deaccessioned,
      count: responseDataPayload.pubstatus_counts.deaccessioned_count
    }
  ]
  return {
    items,
    publicationStatusCounts,
    totalItemCount: responseDataPayload.pagination.numResults,
    countPerObjectType
  }
}

const transformContactsPayloadToContacts = (
  contactsPayload: CollectionContactPayload[]
): CollectionContact[] => {
  return contactsPayload.map((contactPayload) => ({
    email: contactPayload.contactEmail,
    displayOrder: contactPayload.displayOrder
  }))
}
