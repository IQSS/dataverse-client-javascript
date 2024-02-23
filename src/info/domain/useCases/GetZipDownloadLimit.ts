import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository';

export class GetZipDownloadLimit implements UseCase<number> {
  private dataverseInfoRepository: IDataverseInfoRepository;

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository;
  }

  /**
   * Returns a number indicating the configured ZIP download limit in bytes.
   *
   * @returns {Promise<number>}
   */
  async execute(): Promise<number> {
    return await this.dataverseInfoRepository.getZipDownloadLimit();
  }
}
