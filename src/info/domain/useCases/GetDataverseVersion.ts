import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository';
import { DataverseVersion } from '../models/DataverseVersion';

export class GetDataverseVersion implements UseCase<DataverseVersion> {
  private dataverseInfoRepository: IDataverseInfoRepository;

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository;
  }

  async execute(): Promise<DataverseVersion> {
    return await this.dataverseInfoRepository.getDataverseVersion();
  }
}
