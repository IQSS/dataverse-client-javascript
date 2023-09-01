import { FileCounts } from '../../../src/files/domain/models/FileCounts';
import { FileAccessStatus } from '../../../src/files/domain/models/FileCriteria';

export const createFileCountsModel = (): FileCounts => {
  return {
    total: 4,
    perFileContentType: [
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
    perCategoryTag: [
      {
        category: 'testCategory',
        count: 2,
      },
    ],
  };
};
