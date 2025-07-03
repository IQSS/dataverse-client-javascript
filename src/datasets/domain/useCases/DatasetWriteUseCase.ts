import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { DatasetDTO, DatasetMetadataBlockValuesDTO } from '../dtos/DatasetDTO'
import { ResourceValidator } from '../../../core/domain/useCases/validators/ResourceValidator'
import { IMetadataBlocksRepository } from '../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { MetadataBlock } from '../../../metadataBlocks'

export abstract class DatasetWriteUseCase<T> implements UseCase<T> {
  private datasetsRepository: IDatasetsRepository
  private metadataBlocksRepository: IMetadataBlocksRepository
  private newDatasetValidator: ResourceValidator

  constructor(
    datasetsRepository: IDatasetsRepository,
    metadataBlocksRepository: IMetadataBlocksRepository,
    newDatasetValidator: ResourceValidator
  ) {
    this.datasetsRepository = datasetsRepository
    this.metadataBlocksRepository = metadataBlocksRepository
    this.newDatasetValidator = newDatasetValidator
  }

  abstract execute(...args: unknown[]): Promise<T>

  getDatasetsRepository(): IDatasetsRepository {
    return this.datasetsRepository
  }

  getMetadataBlocksRepository(): IMetadataBlocksRepository {
    return this.metadataBlocksRepository
  }

  getNewDatasetValidator(): ResourceValidator {
    return this.newDatasetValidator
  }

  async getNewDatasetMetadataBlocks(dataset: DatasetDTO): Promise<MetadataBlock[]> {
    const metadataBlocks: MetadataBlock[] = []
    await Promise.all(
      dataset.metadataBlockValues.map(async (metadataBlockValue: DatasetMetadataBlockValuesDTO) => {
        metadataBlocks.push(
          await this.metadataBlocksRepository.getMetadataBlockByName(metadataBlockValue.name)
        )
      })
    )
    return metadataBlocks
  }
}
