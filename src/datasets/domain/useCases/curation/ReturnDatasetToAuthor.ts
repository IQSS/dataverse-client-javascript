import { UseCase } from '../../../../core/domain/useCases/UseCase'
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository'

export class ReturnDatasetToAuthor implements UseCase<void> {
  constructor(private readonly datasetsRepository: IDatasetsRepository) {}

  /**
   * Returns a draft in review to its authors. Requires publish permission.
   * The server records the reason and notifies the authors.
   * @param datasetId Numeric dataset ID or persistent identifier.
   * @param reasonForReturn Reason sent to the authors; required unless disabled by server configuration.
   * @see https://guides.dataverse.org/en/latest/api/native-api.html#return-a-dataset-to-author
   */
  async execute(datasetId: number | string, reasonForReturn: string): Promise<void> {
    return await this.datasetsRepository.returnDatasetToAuthor(datasetId, reasonForReturn)
  }
}
