import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { MetadataFieldInfo } from '../..'
import { IMetadataFieldInfosRepository } from '../../domain/repositories/IMetadataFieldInfosRepository'
import { transformMetadataFieldInfosResponseToMetadataFieldInfos } from './transformers/metadataBlockTransformers'

export class MetadataFieldInfosRepository
  extends ApiRepository
  implements IMetadataFieldInfosRepository
{
  private readonly datasetFieldsResourceName: string = 'datasetfields'

  public async getAllFacetableMetadataFields(): Promise<MetadataFieldInfo[]> {
    return this.doGet(`/${this.datasetFieldsResourceName}/facetables`, false)
      .then((response) => transformMetadataFieldInfosResponseToMetadataFieldInfos(response))
      .catch((error) => {
        throw error
      })
  }
}
