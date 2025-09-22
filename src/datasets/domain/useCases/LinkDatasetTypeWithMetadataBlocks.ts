import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'

export class LinkDatasetTypeWithMetadataBlocks implements UseCase<void> {
  private datasetsRepository: IDatasetsRepository

  constructor(datasetsRepository: IDatasetsRepository) {
    this.datasetsRepository = datasetsRepository
  }

  /**
   * Links a dataset type with one or more metadata blocks. These metadata blocks will be shown when creating a dataset of this type.
   */
  async execute(datasetTypeId: number | string, metadataBlocks: string[]): Promise<void> {
    return await this.datasetsRepository.linkDatasetTypeWithMetadataBlocks(
      datasetTypeId,
      metadataBlocks
    )
  }
}
