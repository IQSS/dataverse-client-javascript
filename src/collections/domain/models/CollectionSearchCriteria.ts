export class CollectionSearchCriteria {
  constructor(public readonly searchText?: string) {}

  withSearchText(searchText: string | undefined): CollectionSearchCriteria {
    return new CollectionSearchCriteria(searchText)
  }
}
