import { Author, DatasetContact, DatasetDescription } from './Dataset';

export interface NewDataset {
  title: string;
  authors: Author[];
  contacts: DatasetContact[];
  descriptions: DatasetDescription[];
  subjects: string[];
}
