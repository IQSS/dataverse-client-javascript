import { AxiosResponse } from 'axios'

import { DatasetReview } from '../../../domain/models/DatasetReview'
import { DatasetReviewPayload } from './DatasetReviewPayload'

export const transformDatasetReviewsResponseToDatasetReviews = (
  response: AxiosResponse
): DatasetReview[] => {
  const reviews = (response.data.data?.reviews ?? []) as DatasetReviewPayload[]

  return reviews.map((review) => ({
    title: review.title,
    authors: review.authors ?? [],
    persistentId: review.persistentId,
    persistentIdUrl: review.persistentIdUrl,
    id: review.id,
    citation: review.citation,
    citationHtml: review.citationHtml,
    datePublished: review.datePublished ?? '',
    description: review.description ?? '',
    rubricMetadataBlocks:
      review.rubricMetadataBlocks?.map((metadataBlock) => ({
        name: metadataBlock.name,
        displayName: metadataBlock.displayName,
        fields: metadataBlock.fields ?? []
      })) ?? []
  }))
}
