import { MetadataBlocksUtil } from './metadataBlocksUtil'
import { BasicDatasetInformation } from '../@types/basicDataset'
import { MetadataBlockField } from '../@types/metadataBlockField'

export const EMPTY_ARRAY_LENGTH = 0

export class DatasetUtil {
  public static mapBasicDatasetInformation(datasetInformation: BasicDatasetInformation): object {
    const fields: MetadataBlockField[] = []

    if (!datasetInformation) {
      return undefined
    }

    if (datasetInformation.title) {
      fields.push(MetadataBlocksUtil.createTitleField(datasetInformation.title))
    }

    if (datasetInformation.subtitle) {
      fields.push(MetadataBlocksUtil.createSubtitleField(datasetInformation.subtitle))
    }

    if (datasetInformation.authors && datasetInformation.authors.length > EMPTY_ARRAY_LENGTH) {
      fields.push(MetadataBlocksUtil.createAuthorField(datasetInformation.authors))
    }

    if (datasetInformation.descriptions && datasetInformation.descriptions.length > EMPTY_ARRAY_LENGTH) {
      fields.push(MetadataBlocksUtil.createDescriptionField(datasetInformation.descriptions))
    }

    if (datasetInformation.subject) {
      fields.push(MetadataBlocksUtil.createSubjectField(datasetInformation.subject))
    }

    if (datasetInformation.contact) {
      fields.push(MetadataBlocksUtil.createContactField(datasetInformation.contact))
    }

    return {
      datasetVersion: {
        metadataBlocks: {
          citation: {
            fields: fields,
            displayName: 'Citation Metadata'
          }
        }
      }
    }
  }
}