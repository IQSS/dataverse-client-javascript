import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository';
import { DataverseVersion } from '../models/DataverseVersion';

export class GetDataverseVersion implements UseCase<DataverseVersion> {
  private dataverseInfoRepository: IDataverseInfoRepository;

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository;
  }

  /**
   * Returns a DataverseVersion object, which contains version information for the Dataverse backend installation.
   *
   * @returns {Promise<DataverseVersion>}
   */
  async execute(): Promise<DataverseVersion> {
    return await this.dataverseInfoRepository.getDataverseVersion();
  }
}
