import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { IDatasetTypesRepository } from '../../domain/repositories/IDatasetTypesRepository'
import { DatasetType } from '../../domain/models/DatasetType'

export class DatasetTypesRepository extends ApiRepository implements IDatasetTypesRepository {
  private readonly datasetTypesResourceName: string = 'datasets/datasetTypes'

  public async getAvailableDatasetTypes(): Promise<DatasetType[]> {
    return this.doGet(this.buildApiEndpoint(this.datasetTypesResourceName))
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  }
}
