import { UseCase } from '../../../core/domain/useCases/UseCase'
import { MetadataFieldInfo } from '../..'
import { IMetadataFieldInfosRepository } from '../repositories/IMetadataFieldInfosRepository'

export class GetAllFacetableDatasetFields implements UseCase<MetadataFieldInfo[]> {
  private metadataFieldInfosRepository: IMetadataFieldInfosRepository

  constructor(metadataFieldInfosRepository: IMetadataFieldInfosRepository) {
    this.metadataFieldInfosRepository = metadataFieldInfosRepository
  }

  /**
   * Returns a MetadataFieldInfo array containing all facetable dataset fields defined in the installation.
   *
   * @returns {Promise<MetadataFieldInfo[]>}
   */
  async execute(): Promise<MetadataFieldInfo[]> {
    return await this.metadataFieldInfosRepository.getAllFacetableMetadataFields()
  }
}
