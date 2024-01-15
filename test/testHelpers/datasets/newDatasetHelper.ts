import { NewDataset, NewDatasetMetadataFieldValue } from '../../../src/datasets/domain/models/NewDataset';
import { MetadataBlock } from '../../../src';

export const createNewDatasetModel = (
  authorFieldValue?: NewDatasetMetadataFieldValue | string,
  alternativeTitleValue?: NewDatasetMetadataFieldValue | string,
): NewDataset => {
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
  const validAlternativeTitleValue = ['alternative1', 'alternative2'];
  return {
    metadataBlockValues: [
      {
        name: 'citation',
        fields: {
          title: 'test dataset',
          author: authorFieldValue !== undefined ? authorFieldValue : validAuthorFieldValue,
          alternativeTitle: alternativeTitleValue !== undefined ? alternativeTitleValue : validAlternativeTitleValue,
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
          },
        },
      },
      alternativeTitle: {
        name: 'alternativeTitle',
        displayName: 'Alternative Title',
        title: 'Alternative Title',
        type: 'TEXT',
        watermark: '',
        description: 'Either 1) a title commonly used to refer to the Dataset or 2) an abbreviation of the main title',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 4,
      },
    },
  };
};
