import { NewDataset } from '../../../src/datasets/domain/models/NewDataset';

export const createNewDatasetModel = (): NewDataset => {
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
              authorName: 'Owner, Dataverse',
              authorAffiliation: 'Dataverse.org',
            },
          ],
        },
      },
    ],
  };
};
