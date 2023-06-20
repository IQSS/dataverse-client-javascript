export interface MetadataBlock {
  id: number;
  name: string;
  displayName: string;
  metadataFields: MetadataField[];
}

export interface MetadataField {
  name: string;
  displayName: string;
  title: string;
  type: string;
  watermark: string;
  description: string;
  multiple: boolean;
  isControlledVocabulary: boolean;
  displayFormat: string;
}
