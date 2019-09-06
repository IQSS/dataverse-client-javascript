export interface DataverseSearchOptions {
  q: string,
  subtree?: string,
  start?: number,
  type?: SearchType,
  sort?: SearchSortAttribute,
  order?: SearchOrder,
  per_page?: number,
  show_entity_ids?: boolean,
  show_relevance?: boolean
}

export interface SearchOptions {
  query: string,
  dataverseAlias?: string,
  startPosition?: number,
  type?: SearchType,
  sortAttribute?: SearchSortAttribute,
  order?: SearchOrder,
  itemsPerPage?: number,
  showEntityIds?: boolean,
  showRelevance?: boolean
}

export enum SearchType {
  DATAVERSE = 'dataverse',
  DATASET = 'dataset',
  FILE = 'file'
}

export enum SearchSortAttribute {
  NAME = 'name',
  DATE = 'date'
}

export enum SearchOrder {
  ASC = 'asc',
  DESC = 'desc'
}