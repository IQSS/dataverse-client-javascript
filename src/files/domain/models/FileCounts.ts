import { FileAccessStatus } from './FileCriteria';

export interface FileCounts {
  total: number;
  perFileContentType: FileContentTypeCount[];
  perAccessStatus: FileAccessStatusCount[];
  perCategoryTag: FileCategoryCount[];
}

export interface FileContentTypeCount {
  contentType: string;
  count: number;
}

export interface FileAccessStatusCount {
  accessStatus: FileAccessStatus;
  count: number;
}

export interface FileCategoryCount {
  category: string;
  count: number;
}
