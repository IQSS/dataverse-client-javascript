import { DatasetSubjects } from './datasetSubjects';

export interface BasicDatasetAuthor {
  fullname: string;
  affiliation?: string;
}

export interface BasicDatasetDescription {
  text: string;
  date?: string;
}

export interface BasicDatasetContact {
  email: string;
  fullname?: string;
}

export interface BasicDatasetInformation {
  title: string;
  subtitle?: string;
  descriptions: BasicDatasetDescription[];
  authors: BasicDatasetAuthor[];
  contact: BasicDatasetContact[];
  subject: DatasetSubjects[];
}
