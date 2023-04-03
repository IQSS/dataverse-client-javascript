export interface MetadataBlockField {
  typeName: string;
  typeClass: string;
  multiple: boolean;
  value: string | MetadataBlockField[];
}

export interface MetadataBlockFieldAuthor {
  authorName: MetadataBlockField;
  authorAffiliation?: MetadataBlockField;
}

export interface MetadataBlockFieldDescription {
  dsDescriptionValue: MetadataBlockField;
  dsDescriptionDate?: MetadataBlockField;
}

export interface MetadataBlockFieldContact {
  datasetContactEmail?: MetadataBlockField;
  datasetContactName?: MetadataBlockField;
}
