export interface MetadataBlock {
  id: number;
  name: string;
  displayName: string;
  metadataFields: Record<string, MetadataFieldInfo>;
}

export interface MetadataFieldInfo {
  name: string;
  displayName: string;
  title: string;
  type: string;
  watermark: string;
  description: string;
  multiple: boolean;
  isControlledVocabulary: boolean;
  displayFormat: string;
  childMetadataFields?: Record<string, MetadataFieldInfo>;
}
