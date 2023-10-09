export class FileSearchCriteria {
  constructor(
    public readonly contentType?: string,
    public readonly accessStatus?: FileAccessStatus,
    public readonly categoryName?: string,
    public readonly searchText?: string,
  ) {}

  withContentType(contentType: string | undefined): FileSearchCriteria {
    return new FileSearchCriteria(contentType, this.accessStatus, this.categoryName);
  }

  withAccessStatus(accessStatus: FileAccessStatus | undefined): FileSearchCriteria {
    return new FileSearchCriteria(this.contentType, accessStatus, this.categoryName);
  }

  withCategoryName(categoryName: string | undefined): FileSearchCriteria {
    return new FileSearchCriteria(this.contentType, this.accessStatus, categoryName);
  }

  withSearchText(searchText: string | undefined): FileSearchCriteria {
    return new FileSearchCriteria(this.contentType, this.accessStatus, this.categoryName, searchText);
  }
}

export enum FileOrderCriteria {
  NAME_AZ = 'NameAZ',
  NAME_ZA = 'NameZA',
  NEWEST = 'Newest',
  OLDEST = 'Oldest',
  SIZE = 'Size',
  TYPE = 'Type',
}

export enum FileAccessStatus {
  PUBLIC = 'Public',
  RESTRICTED = 'Restricted',
  EMBARGOED = 'EmbargoedThenRestricted',
  EMBARGOED_RESTRICTED = 'EmbargoedThenPublic',
}
