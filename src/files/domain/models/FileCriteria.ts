export class FileCriteria {
  constructor(
    public readonly orderCriteria: FileOrderCriteria = FileOrderCriteria.NAME_AZ,
    public readonly contentType?: string,
    public readonly accessStatus?: FileAccessStatus,
    public readonly categoryName?: string,
    public readonly searchText?: string,
  ) {}

  withOrderCriteria(orderCriteria: FileOrderCriteria): FileCriteria {
    return new FileCriteria(orderCriteria, this.contentType, this.accessStatus, this.categoryName);
  }

  withContentType(contentType: string | undefined): FileCriteria {
    return new FileCriteria(this.orderCriteria, contentType, this.accessStatus, this.categoryName);
  }

  withAccessStatus(accessStatus: FileAccessStatus | undefined): FileCriteria {
    return new FileCriteria(this.orderCriteria, this.contentType, accessStatus, this.categoryName);
  }

  withCategoryName(categoryName: string | undefined): FileCriteria {
    return new FileCriteria(this.orderCriteria, this.contentType, this.accessStatus, categoryName);
  }

  withSearchText(searchText: string | undefined): FileCriteria {
    return new FileCriteria(this.orderCriteria, this.contentType, this.accessStatus, this.categoryName, searchText);
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
