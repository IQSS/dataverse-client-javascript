import { UseCase } from '../../../core/domain/useCases/UseCase';
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository';

export class IsEmbargoEnabled implements UseCase<boolean> {
  private dataverseInfoRepository: IDataverseInfoRepository;

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository;
  }

  async execute(): Promise<boolean> {
    return await this.dataverseInfoRepository.isEmbargoEnabled();
  }
}
