export class FileSearchCriteria {
  constructor(
    public readonly contentType?: string,
    public readonly accessStatus?: FileAccessStatus,
    public readonly categoryName?: string,
    public readonly tabularTagName?: string,
    public readonly searchText?: string
  ) {}

  withContentType(contentType: string | undefined): FileSearchCriteria {
    return new FileSearchCriteria(
      contentType,
      this.accessStatus,
      this.categoryName,
      this.tabularTagName,
      this.searchText
    )
  }

  withAccessStatus(accessStatus: FileAccessStatus | undefined): FileSearchCriteria {
    return new FileSearchCriteria(
      this.contentType,
      accessStatus,
      this.categoryName,
      this.tabularTagName,
      this.searchText
    )
  }

  withCategoryName(categoryName: string | undefined): FileSearchCriteria {
    return new FileSearchCriteria(
      this.contentType,
      this.accessStatus,
      categoryName,
      this.tabularTagName,
      this.searchText
    )
  }

  withTabularTagName(tabularTagName: string | undefined): FileSearchCriteria {
    return new FileSearchCriteria(
      this.contentType,
      this.accessStatus,
      this.categoryName,
      tabularTagName,
      this.searchText
    )
  }

  withSearchText(searchText: string | undefined): FileSearchCriteria {
    return new FileSearchCriteria(
      this.contentType,
      this.accessStatus,
      this.categoryName,
      this.tabularTagName,
      searchText
    )
  }
}

export enum FileOrderCriteria {
  NAME_AZ = 'NameAZ',
  NAME_ZA = 'NameZA',
  NEWEST = 'Newest',
  OLDEST = 'Oldest',
  SIZE = 'Size',
  TYPE = 'Type'
}

export enum FileAccessStatus {
  PUBLIC = 'Public',
  RESTRICTED = 'Restricted',
  EMBARGOED = 'EmbargoedThenPublic',
  EMBARGOED_RESTRICTED = 'EmbargoedThenRestricted'
}
