import { Result } from '../../../core/domain/useCases/Result';
import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository';

export class GetDataverseVersion implements UseCase<string> {
  private dataverseInfoRepository: IDataverseInfoRepository;

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository;
  }

  async execute(): Promise<Result<string>> {
    try {
      const dataverseVersion = await this.dataverseInfoRepository.getDataverseVersion();
      return Result.success(dataverseVersion);
    } catch (error) {
      return Result.error(error.message);
    }
  }
}
