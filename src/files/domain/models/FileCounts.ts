import { FileAccessStatus } from './FileCriteria';

export interface FileCounts {
  total: number;
  perContentType: FileContentTypeCount[];
  perAccessStatus: FileAccessStatusCount[];
  perCategoryName: FileCategoryNameCount[];
}

export interface FileContentTypeCount {
  contentType: string;
  count: number;
}

export interface FileAccessStatusCount {
  accessStatus: FileAccessStatus;
  count: number;
}

export interface FileCategoryNameCount {
  categoryName: string;
  count: number;
}
