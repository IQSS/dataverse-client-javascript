import { NewDataset, NewDatasetMetadataFieldValue } from '../../../src/datasets/domain/models/NewDataset';
import { MetadataBlock } from '../../../src';

export const createNewDatasetModel = (
  titleFieldValue?: NewDatasetMetadataFieldValue,
  authorFieldValue?: NewDatasetMetadataFieldValue,
  alternativeRequiredTitleValue?: NewDatasetMetadataFieldValue,
  timePeriodCoveredStartValue?: NewDatasetMetadataFieldValue,
  contributorTypeValue?: NewDatasetMetadataFieldValue,
): NewDataset => {
  const validTitle = 'test dataset';
  const validAuthorFieldValue = [
    {
      authorName: 'Admin, Dataverse',
      authorAffiliation: 'Dataverse.org',
    },
    {
      authorName: 'Owner, Dataverse',
      authorAffiliation: 'Dataverse.org',
    },
  ];
  const validAlternativeRequiredTitleValue = ['alternative1', 'alternative2'];
  return {
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
          ...(timePeriodCoveredStartValue && { timePeriodCoveredStart: timePeriodCoveredStartValue }),
          ...(contributorTypeValue && {
            contributor: [
              {
                contributorName: 'Admin, Dataverse',
                contributorType: contributorTypeValue as string,
              },
            ],
          }),
        },
      },
    ],
  };
};

export const createNewDatasetModelWithoutFirstLevelRequiredField = (): NewDataset => {
  return {
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'test dataset',
        },
      },
    ],
  };
};

export const createNewDatasetModelWithoutSecondLevelRequiredField = (): NewDataset => {
  return {
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'test dataset',
          author: [
            {
              authorName: 'Admin, Dataverse',
              authorAffiliation: 'Dataverse.org',
            },
            {
              authorAffiliation: 'Dataverse.org',
            },
          ],
        },
      },
    ],
  };
};

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
    metadataFields: {
      title: {
        name: 'title',
        displayName: 'title',
        title: 'title',
        type: 'DatasetField',
        watermark: 'watermark',
        description: 'description',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 0,
        typeClass: 'primitive',
      },
      author: {
        name: 'author',
        displayName: 'author',
        title: 'author',
        type: 'NONE',
        watermark: 'watermark',
        description: 'description',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 1,
        typeClass: 'compound',
        childMetadataFields: {
          authorName: {
            name: 'authorName',
            displayName: 'author name',
            title: 'author name',
            type: 'TEXT',
            watermark: 'watermark',
            description: 'description',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 2,
            typeClass: 'primitive',
          },
          authorAffiliation: {
            name: 'authorAffiliation',
            displayName: 'author affiliation',
            title: 'author affiliation',
            type: 'TEXT',
            watermark: 'watermark',
            description: 'descriprion',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: false,
            displayOrder: 3,
            typeClass: 'primitive',
          },
        },
      },
      alternativeRequiredTitle: {
        name: 'alternativeRequiredTitle',
        displayName: 'Alternative Required Title',
        title: 'Alternative Title',
        type: 'TEXT',
        watermark: '',
        description: 'Either 1) a title commonly used to refer to the Dataset or 2) an abbreviation of the main title',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 4,
        typeClass: 'primitive',
      },
      timePeriodCoveredStart: {
        name: 'timePeriodCoveredStart',
        displayName: 'Time Period Start Date',
        title: 'Start Date',
        type: 'DATE',
        watermark: 'YYYY-MM-DD',
        description: 'The start date of the time period that the data refer to',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#NAME: #VALUE ',
        isRequired: false,
        displayOrder: 5,
        typeClass: 'primitive',
      },
      contributor: {
        name: 'contributor',
        displayName: 'Contributor',
        title: 'Contributor',
        type: 'NONE',
        watermark: '',
        description:
          'The entity, such as a person or organization, responsible for collecting, managing, or otherwise contributing to the development of the Dataset',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: ':',
        isRequired: false,
        displayOrder: 6,
        typeClass: 'compound',
        childMetadataFields: {
          contributorType: {
            name: 'contributorType',
            displayName: 'Contributor Type',
            title: 'Type',
            type: 'TEXT',
            watermark: '',
            description: 'Indicates the type of contribution made to the dataset',
            multiple: false,
            isControlledVocabulary: true,
            displayFormat: '#VALUE ',
            isRequired: false,
            displayOrder: 7,
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
              'Other',
            ],
            typeClass: 'controlledVocabulary',
          },
          contributorName: {
            name: 'contributorName',
            displayName: 'Contributor Name',
            title: 'Name',
            type: 'TEXT',
            watermark: '1) FamilyName, GivenName or 2) Organization',
            description: "The name of the contributor, e.g. the person's name or the name of an organization",
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 8,
            typeClass: 'primitive',
          },
        },
      },
    },
  };
};
