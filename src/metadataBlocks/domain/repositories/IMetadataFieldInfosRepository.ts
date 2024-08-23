import { MetadataFieldInfo } from '../..'

export interface IMetadataFieldInfosRepository {
  getAllFacetableMetadataFields(): Promise<MetadataFieldInfo[]>
}
