import { DatasetReview } from '../../../src/datasets/domain/models/DatasetReview'
import { DatasetReviewPayload } from '../../../src/datasets/infra/repositories/transformers/DatasetReviewPayload'

export const createDatasetReviewModel = (): DatasetReview => ({
  title: 'Review of Pediatric Asthma',
  authors: ['Wazowski, Mike'],
  persistentId: 'doi:10.5072/FK2/1WD6BX',
  persistentIdUrl: 'https://doi.org/10.5072/FK2/1WD6BX',
  id: 13,
  citation:
    'Wazowski, Mike, 2026, "Review of Pediatric Asthma", https://doi.org/10.5072/FK2/1WD6BX, Root, DRAFT VERSION',
  citationHtml:
    'Wazowski, Mike, 2026, "Review of Pediatric Asthma", <a href="https://doi.org/10.5072/FK2/1WD6BX">https://doi.org/10.5072/FK2/1WD6BX</a>, Root, DRAFT VERSION',
  datePublished: '',
  description: 'This is a review of a dataset.',
  rubricMetadataBlocks: [
    {
      name: 'rubric_trusteddatadimensionsintensities',
      displayName: 'Trusted Data Dimensions and Intensities',
      fields: [
        {
          typeName: 'licensingAndLegalClarity',
          value: 'High'
        },
        {
          typeName: 'authorAndProvenance',
          value: 'Medium'
        }
      ]
    }
  ]
})

export const createDatasetReviewPayload = (): DatasetReviewPayload => ({
  title: 'Review of Pediatric Asthma',
  authors: ['Wazowski, Mike'],
  persistentId: 'doi:10.5072/FK2/1WD6BX',
  persistentIdUrl: 'https://doi.org/10.5072/FK2/1WD6BX',
  id: 13,
  citation:
    'Wazowski, Mike, 2026, "Review of Pediatric Asthma", https://doi.org/10.5072/FK2/1WD6BX, Root, DRAFT VERSION',
  citationHtml:
    'Wazowski, Mike, 2026, "Review of Pediatric Asthma", <a href="https://doi.org/10.5072/FK2/1WD6BX">https://doi.org/10.5072/FK2/1WD6BX</a>, Root, DRAFT VERSION',
  datePublished: '',
  description: 'This is a review of a dataset.',
  rubricMetadataBlocks: [
    {
      name: 'rubric_trusteddatadimensionsintensities',
      displayName: 'Trusted Data Dimensions and Intensities',
      fields: [
        {
          typeName: 'licensingAndLegalClarity',
          value: 'High'
        },
        {
          typeName: 'authorAndProvenance',
          value: 'Medium'
        }
      ]
    }
  ]
})
