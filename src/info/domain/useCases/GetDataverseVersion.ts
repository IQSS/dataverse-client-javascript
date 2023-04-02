import { Result } from '../../../core/domain/Result';
import { UseCase } from '../../../core/domain/UseCase';
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository';

export class GetDataverseVersion implements UseCase<string> {
  private dataverseInfoRepository: IDataverseInfoRepository;

  async execute(): Promise<Result<string>> {
    const dataverseVersion = await this.dataverseInfoRepository.getDataverseVersion();
    return Result.success(dataverseVersion);
  }
}
