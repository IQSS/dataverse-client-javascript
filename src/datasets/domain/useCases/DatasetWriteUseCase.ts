import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../repositories/IDatasetsRepository'
import { NewDatasetDTO, NewDatasetMetadataBlockValuesDTO } from '../dtos/NewDatasetDTO'
import { NewResourceValidator } from '../../../core/domain/useCases/validators/NewResourceValidator'
import { IMetadataBlocksRepository } from '../../../metadataBlocks/domain/repositories/IMetadataBlocksRepository'
import { MetadataBlock } from '../../../metadataBlocks'

export abstract class DatasetWriteUseCase<T> implements UseCase<T> {
  private datasetsRepository: IDatasetsRepository
  private metadataBlocksRepository: IMetadataBlocksRepository
  private newDatasetValidator: NewResourceValidator

  constructor(
    datasetsRepository: IDatasetsRepository,
    metadataBlocksRepository: IMetadataBlocksRepository,
    newDatasetValidator: NewResourceValidator
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

  getNewDatasetValidator(): NewResourceValidator {
    return this.newDatasetValidator
  }

  async getNewDatasetMetadataBlocks(newDataset: NewDatasetDTO): Promise<MetadataBlock[]> {
    const metadataBlocks: MetadataBlock[] = []
    await Promise.all(
      newDataset.metadataBlockValues.map(
        async (metadataBlockValue: NewDatasetMetadataBlockValuesDTO) => {
          metadataBlocks.push(
            await this.metadataBlocksRepository.getMetadataBlockByName(metadataBlockValue.name)
          )
        }
      )
    )
    return metadataBlocks
  }
}
