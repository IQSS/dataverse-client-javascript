import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository';

export class GetZipDownloadLimit implements UseCase<number> {
  private dataverseInfoRepository: IDataverseInfoRepository;

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository;
  }

  async execute(): Promise<number> {
    return await this.dataverseInfoRepository.getZipDownloadLimit();
  }
}
