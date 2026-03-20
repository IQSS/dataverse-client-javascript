import { UseCase } from '../../../core/domain/useCases/UseCase'
import { IDataverseInfoRepository } from '../repositories/IDataverseInfoRepository'

export class GetDatasetPublishPopupCustomText implements UseCase<string> {
  private dataverseInfoRepository: IDataverseInfoRepository

  constructor(dataverseInfoRepository: IDataverseInfoRepository) {
    this.dataverseInfoRepository = dataverseInfoRepository
  }

  /**
   * Returns a string containing custom text for the Publish Dataset modal.
   *
   * @returns {Promise<string>}
   */
  async execute(): Promise<string> {
    return await this.dataverseInfoRepository.getDatasetPublishPopupCustomText()
  }
}
