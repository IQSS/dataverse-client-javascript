import { MetadataBlock } from '../../../src/metadataBlocks/domain/models/MetadataBlock';

export const createMetadataBlockModel = (): MetadataBlock => {
  return {
    id: 1,
    name: 'testName',
    displayName: 'testDisplayName',
    metadataFields: [
      {
        name: 'testName',
        displayName: 'testDisplayName',
        title: 'testTitle',
        type: 'testType',
        watermark: 'testWatermark',
        description: 'testDescription',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: 'testDisplayFormat',
      },
    ],
  };
};
