import { assert, createSandbox, SinonSandbox } from 'sinon';
import { createNewDatasetMetadataBlockModel, createNewDatasetModel } from '../../testHelpers/datasets/newDatasetHelper';
import {
  transformNewDatasetModelToRequestPayload,
  NewDatasetRequestPayload,
} from '../../../src/datasets/infra/repositories/transformers/newDatasetTransformers';

describe('transformNewDatasetModelToRequestPayload', () => {
  const sandbox: SinonSandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  test('happy path WIP', async () => {
    const testNewDataset = createNewDatasetModel();
    const testMetadataBlocks = [createNewDatasetMetadataBlockModel()];

    const expected: NewDatasetRequestPayload = {
      datasetVersion: {
        metadataBlocks: {
          citation: {
            fields: [
              {
                value: 'test dataset',
                typeClass: 'primitive',
                multiple: false,
                typeName: 'title',
              },
              {
                value: [
                  {
                    authorName: {
                      value: 'Admin, Dataverse',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'authorName',
                    },
                    authorAffiliation: {
                      value: 'Dataverse.org',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'authorAffiliation',
                    },
                  },
                  {
                    authorName: {
                      value: 'Owner, Dataverse',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'authorName',
                    },
                    authorAffiliation: {
                      value: 'Dataverse.org',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'authorAffiliation',
                    },
                  },
                ],
                typeClass: 'compound',
                multiple: true,
                typeName: 'author',
              },
              {
                value: ['alternative1', 'alternative2'],
                typeClass: 'primitive',
                multiple: true,
                typeName: 'alternativeRequiredTitle',
              },
            ],
            displayName: 'Citation Metadata',
          },
        },
      },
    };

    const actual = transformNewDatasetModelToRequestPayload(testNewDataset, testMetadataBlocks);
    //assert.match(actual, expected);
    assert.match(
      actual.datasetVersion.metadataBlocks.citation.fields[1].value,
      expected.datasetVersion.metadataBlocks.citation.fields[1].value,
    );
  });
});
