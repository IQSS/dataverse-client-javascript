import { NewDataset } from '../../../src/datasets/domain/models/NewDataset';

export const createNewDatasetModel = (): NewDataset => {
  return {
    title: 'test',
    authors: [
      {
        authorName: 'Admin, Dataverse',
        authorAffiliation: 'Dataverse.org',
      },
      {
        authorName: 'Owner, Dataverse',
        authorAffiliation: 'Dataverse.org',
      },
    ],
    subjects: ['Subject1', 'Subject2'],
    contacts: [
      {
        datasetContactName: 'Admin, Dataverse',
        datasetContactEmail: 'someemail@test.com',
      },
    ],
    descriptions: [
      {
        dsDescriptionValue: 'test',
      },
    ],
  };
};
