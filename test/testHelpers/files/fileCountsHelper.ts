import { FileCounts } from '../../../src/files/domain/models/FileCounts';
import { FileAccessStatus } from '../../../src/files/domain/models/FileCriteria';

export const createFileCountsModel = (): FileCounts => {
  return {
    total: 4,
    perContentType: [
      {
        contentType: 'text/plain',
        count: 4,
      },
    ],
    perAccessStatus: [
      {
        accessStatus: FileAccessStatus.PUBLIC,
        count: 3,
      },
      {
        accessStatus: FileAccessStatus.RESTRICTED,
        count: 1,
      },
    ],
    perCategoryName: [
      {
        categoryName: 'testCategory',
        count: 2,
      },
    ],
  };
};

export const createFileCountsPayload = (): any => {
  return {
    total: 4,
    perContentType: {
      'text/plain': 4,
    },
    perAccessStatus: {
      Public: 3,
      Restricted: 1,
    },
    perCategoryName: {
      testCategory: 2,
    },
  };
};
