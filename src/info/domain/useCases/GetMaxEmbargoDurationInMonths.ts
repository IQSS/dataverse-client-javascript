import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository'

export class GetMaxEmbargoDurationInMonths implements UseCase<number> {
  private dataverseInfoRepository: IDataverseInfoRepository

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository
  }

  /**
   * Returns a number indicating the configured maximum embargo duration in months.
   *
   * @returns {Promise<number>}
   */
  async execute(): Promise<number> {
    return await this.dataverseInfoRepository.getMaxEmbargoDurationInMonths()
  }
}
