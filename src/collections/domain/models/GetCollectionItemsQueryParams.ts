export enum GetCollectionItemsQueryParams {
  QUERY = 'q',
  SHOW_FACETS = 'show_facets',
  SORT = 'sort',
  ORDER = 'order',
  SUBTREE = 'subtree',
  PER_PAGE = 'per_page',
  START = 'start',
  TYPE = 'type',
  FILTERQUERY = 'fq'
}

export enum SortType {
  NAME = 'name',
  DATE = 'date'
}

export enum OrderType {
  ASC = 'asc',
  DESC = 'desc'
}

export type FilterQuery = `${string}:${string}`
