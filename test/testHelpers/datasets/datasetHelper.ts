import { Dataset, DatasetVersionState } from '../../../src/datasets/domain/models/Dataset';

export const createDataset = (): Dataset => {
  return {
    id: 1,
    persistentId: 'doi:10.5072/FK2/HC6KTB',
    versionId: 19,
    versionInfo: {
      majorNumber: 1,
      minorNumber: 0,
      state: DatasetVersionState.RELEASED,
      createTime: new Date('2020-01-01'),
      lastUpdateTime: new Date('2020-01-05'),
      releaseTime: new Date('2020-01-03'),
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
        },
      },
    ],
  };
};
