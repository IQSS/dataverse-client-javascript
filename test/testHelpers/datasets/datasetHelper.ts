import { Dataset, DatasetVersionState } from '../../../src/datasets/domain/models/Dataset';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const DATASET_CREATE_TIME_STR = '2023-05-15T08:21:01Z';
const DATASET_UPDATE_TIME_STR = '2023-05-15T08:21:03Z';
const DATASET_RELEASE_TIME_STR = '2023-05-15T08:21:03Z';

const DATASET_HTML_DESCRIPTION =
  '<div><h1 class="test-class-to-ignore">Title 1</h1><p>Test paragraph 1</p><p>Test paragraph 2</p><p>Hello world</p><h2>Title 2</h2><h3>Title 3</h3></div>';

export const createDatasetModel = (): Dataset => {
  return {
    id: 1,
    persistentId: 'doi:10.5072/FK2/HC6KTB',
    versionId: 19,
    versionInfo: {
      majorNumber: 1,
      minorNumber: 0,
      state: DatasetVersionState.RELEASED,
      createTime: new Date(DATASET_CREATE_TIME_STR),
      lastUpdateTime: new Date(DATASET_UPDATE_TIME_STR),
      releaseTime: new Date(DATASET_RELEASE_TIME_STR),
    },
    license: {
      name: 'CC0 1.0',
      uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    metadataBlocks: [
      {
        name: 'citation',
        fields: {
          title: 'test',
          author: [
            {
              authorName: 'Admin, Dataverse',
              authorAffiliation: 'Dataverse.org',
            },
            {
              authorName: 'Owner, Dataverse',
              authorAffiliation: 'Dataverse.org',
            },
          ],
          subject: ['Subject1', 'Subject2'],
          dsDescription: [
            {
              dsDescriptionValue: NodeHtmlMarkdown.translate(DATASET_HTML_DESCRIPTION),
            },
          ],
        },
      },
    ],
  };
};

export const createDatasetVersionPayload = (): any => {
  return {
    id: 19,
    datasetId: 1,
    datasetPersistentId: 'doi:10.5072/FK2/HC6KTB',
    versionNumber: 1,
    versionMinorNumber: 0,
    versionState: 'RELEASED',
    lastUpdateTime: DATASET_UPDATE_TIME_STR,
    releaseTime: DATASET_RELEASE_TIME_STR,
    createTime: DATASET_CREATE_TIME_STR,
    license: { name: 'CC0 1.0', uri: 'https://creativecommons.org/publicdomain/zero/1.0/' },
    metadataBlocks: {
      citation: {
        name: 'citation',
        fields: [
          {
            typeName: 'title',
            multiple: false,
            typeClass: 'primitive',
            value: 'test',
          },
          {
            typeName: 'author',
            multiple: true,
            typeClass: 'compound',
            value: [
              {
                authorName: {
                  typeName: 'authorName',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Admin, Dataverse',
                },
                authorAffiliation: {
                  typeName: 'authorAffiliation',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Dataverse.org',
                },
              },
              {
                authorName: {
                  typeName: 'authorName',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Owner, Dataverse',
                },
                authorAffiliation: {
                  typeName: 'authorAffiliation',
                  multiple: false,
                  typeClass: 'primitive',
                  value: 'Dataverse.org',
                },
              },
            ],
          },
          {
            typeName: 'subject',
            multiple: true,
            typeClass: 'controlledVocabulary',
            value: ['Subject1', 'Subject2'],
          },
          {
            typeName: 'dsDescription',
            multiple: true,
            typeClass: 'compound',
            value: [
              {
                dsDescriptionValue: {
                  typeName: 'dsDescriptionValue',
                  multiple: false,
                  typeClass: 'primitive',
                  value: DATASET_HTML_DESCRIPTION,
                },
              },
            ],
          },
        ],
      },
    },
    files: [],
  };
};
