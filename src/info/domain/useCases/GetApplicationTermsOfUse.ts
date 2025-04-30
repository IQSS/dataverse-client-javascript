import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository'

export class GetApplicationTermsOfUse implements UseCase<string> {
  private dataverseInfoRepository: IDataverseInfoRepository

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository
  }

  /**
   * Returns a string containing the application terms of use.
   *
   * @returns {Promise<string>}
   */
  async execute(lang?: string): Promise<string> {
    return await this.dataverseInfoRepository.getApplicationTermsOfUse(lang)
  }
}
