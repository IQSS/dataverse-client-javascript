import {
  NewDatasetDTO,
  NewDatasetMetadataFieldValueDTO
} from '../../../src/datasets/domain/dtos/NewDatasetDTO'
import { DatasetLicense, MetadataBlock, MetadataFieldType } from '../../../src'
import { NewDatasetRequestPayload } from '../../../src/datasets/infra/repositories/transformers/newDatasetTransformers'
import {
  MetadataFieldWatermark,
  MetadataFieldTypeClass
} from '../../../src/metadataBlocks/domain/models/MetadataBlock'

export const createNewDatasetDTO = (
  titleFieldValue?: NewDatasetMetadataFieldValueDTO,
  authorFieldValue?: NewDatasetMetadataFieldValueDTO,
  alternativeRequiredTitleValue?: NewDatasetMetadataFieldValueDTO,
  timePeriodCoveredStartValue?: NewDatasetMetadataFieldValueDTO,
  contributorTypeValue?: NewDatasetMetadataFieldValueDTO,
  license?: DatasetLicense
): NewDatasetDTO => {
  const validTitle = 'test dataset'
  const validAuthorFieldValue = [
    {
      authorName: 'Admin, Dataverse',
      authorAffiliation: 'Dataverse.org'
    },
    {
      authorName: 'Owner, Dataverse',
      authorAffiliation: 'Dataverse.org'
    }
  ]
  const validAlternativeRequiredTitleValue = ['alternative1', 'alternative2']
  return {
    ...(license && { license }),
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: titleFieldValue !== undefined ? titleFieldValue : validTitle,
          author: authorFieldValue !== undefined ? authorFieldValue : validAuthorFieldValue,
          alternativeRequiredTitle:
            alternativeRequiredTitleValue !== undefined
              ? alternativeRequiredTitleValue
              : validAlternativeRequiredTitleValue,
          ...(timePeriodCoveredStartValue && {
            timePeriodCoveredStart: timePeriodCoveredStartValue
          }),
          ...(contributorTypeValue && {
            contributor: [
              {
                contributorName: 'Admin, Dataverse',
                contributorType: contributorTypeValue as string
              }
            ]
          })
        }
      }
    ]
  }
}

export const createNewDatasetDTOWithoutFirstLevelRequiredField = (): NewDatasetDTO => {
  return {
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'test dataset'
        }
      }
    ]
  }
}

export const createNewDatasetDTOWithoutSecondLevelRequiredField = (): NewDatasetDTO => {
  return {
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'test dataset',
          author: [
            {
              authorName: 'Admin, Dataverse',
              authorAffiliation: 'Dataverse.org'
            },
            {
              authorAffiliation: 'Dataverse.org'
            }
          ]
        }
      }
    ]
  }
}

/**
 *
 * This method creates a simplified and altered version of the Citation Metadata Block, only for testing purposes.
 * For this reason some of the metadata fields do not correspond to the real ones.
 *
 * @returns {MetadataBlock} A MetadataBlock testing instance.
 *
 **/
export const createNewDatasetMetadataBlockModel = (): MetadataBlock => {
  return {
    id: 1,
    name: 'citation',
    displayName: 'Citation Metadata',
    displayOnCreate: true,
    metadataFields: {
      title: {
        name: 'title',
        displayName: 'title',
        title: 'title',
        type: MetadataFieldType.Text,
        watermark: MetadataFieldWatermark.Empty,
        description: 'description',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 0,
        displayOnCreate: true,
        typeClass: MetadataFieldTypeClass.Primitive
      },
      author: {
        name: 'author',
        displayName: 'author',
        title: 'author',
        type: MetadataFieldType.None,
        watermark: MetadataFieldWatermark.Empty,
        description: 'description',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 1,
        typeClass: MetadataFieldTypeClass.Compound,
        displayOnCreate: true,
        childMetadataFields: {
          authorName: {
            name: 'authorName',
            displayName: 'author name',
            title: 'author name',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'description',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 2,
            displayOnCreate: true,
            typeClass: MetadataFieldTypeClass.Primitive
          },
          authorAffiliation: {
            name: 'authorAffiliation',
            displayName: 'author affiliation',
            title: 'author affiliation',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'descriprion',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: false,
            displayOrder: 3,
            displayOnCreate: true,
            typeClass: MetadataFieldTypeClass.Primitive
          }
        }
      },
      alternativeRequiredTitle: {
        name: 'alternativeRequiredTitle',
        displayName: 'Alternative Required Title',
        title: 'Alternative Title',
        type: MetadataFieldType.Text,
        watermark: MetadataFieldWatermark.Empty,
        description:
          'Either 1) a title commonly used to refer to the Dataset or 2) an abbreviation of the main title',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 4,
        displayOnCreate: true,
        typeClass: MetadataFieldTypeClass.Primitive
      },
      timePeriodCoveredStart: {
        name: 'timePeriodCoveredStart',
        displayName: 'Time Period Start Date',
        title: 'Start Date',
        type: MetadataFieldType.Date,
        watermark: MetadataFieldWatermark.Empty,
        description: 'The start date of the time period that the data refer to',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#NAME: #VALUE ',
        isRequired: false,
        displayOrder: 5,
        displayOnCreate: true,
        typeClass: MetadataFieldTypeClass.Primitive
      },
      contributor: {
        name: 'contributor',
        displayName: 'Contributor',
        title: 'Contributor',
        type: MetadataFieldType.None,
        watermark: MetadataFieldWatermark.Empty,
        description:
          'The entity, such as a person or organization, responsible for collecting, managing, or otherwise contributing to the development of the Dataset',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: ':',
        isRequired: false,
        displayOrder: 6,
        typeClass: MetadataFieldTypeClass.Compound,
        displayOnCreate: true,
        childMetadataFields: {
          contributorType: {
            name: 'contributorType',
            displayName: 'Contributor Type',
            title: 'Type',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'Indicates the type of contribution made to the dataset',
            multiple: false,
            isControlledVocabulary: true,
            displayFormat: '#VALUE ',
            isRequired: false,
            displayOrder: 7,
            displayOnCreate: true,
            controlledVocabularyValues: [
              'Data Collector',
              'Data Curator',
              'Data Manager',
              'Editor',
              'Funder',
              'Hosting Institution',
              'Project Leader',
              'Project Manager',
              'Project Member',
              'Related Person',
              'Researcher',
              'Research Group',
              'Rights Holder',
              'Sponsor',
              'Supervisor',
              'Work Package Leader',
              'Other'
            ],
            typeClass: MetadataFieldTypeClass.ControlledVocabulary
          },
          contributorName: {
            name: 'contributorName',
            displayName: 'Contributor Name',
            title: 'Name',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description:
              "The name of the contributor, e.g. the person's name or the name of an organization",
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 8,
            typeClass: MetadataFieldTypeClass.Primitive,
            displayOnCreate: true
          }
        }
      }
    }
  }
}

export const createNewDatasetRequestPayload = (
  license?: DatasetLicense
): NewDatasetRequestPayload => {
  return {
    datasetVersion: {
      ...(license && { license }),
      metadataBlocks: {
        citation: {
          fields: [
            {
              value: 'test dataset',
              typeClass: 'primitive',
              multiple: false,
              typeName: 'title'
            },
            {
              value: [
                {
                  authorName: {
                    value: 'Admin, Dataverse',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorName'
                  },
                  authorAffiliation: {
                    value: 'Dataverse.org',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorAffiliation'
                  }
                },
                {
                  authorName: {
                    value: 'Owner, Dataverse',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorName'
                  },
                  authorAffiliation: {
                    value: 'Dataverse.org',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'authorAffiliation'
                  }
                }
              ],
              typeClass: 'compound',
              multiple: true,
              typeName: 'author'
            },
            {
              value: ['alternative1', 'alternative2'],
              typeClass: 'primitive',
              multiple: true,
              typeName: 'alternativeRequiredTitle'
            }
          ],
          displayName: 'Citation Metadata'
        }
      }
    }
  }
}
