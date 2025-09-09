import { UseCase } from '../../../core/domain/useCases/UseCase'
import { License } from '../models/License'
import { ILicensesRepository } from '../repositories/ILicensesRepository'

export class GetAvailableStandardLicenses implements UseCase<License[]> {
  private licensesRepository: ILicensesRepository

  constructor(licensesRepository: ILicensesRepository) {
    this.licensesRepository = licensesRepository
  }

  /**
   * Returns the list of available standard license terms that can be selected for a dataset.
   *
   * @returns {Promise<License[]>}
   */
  async execute(): Promise<License[]> {
    return await this.licensesRepository.getAvailableStandardLicenses()
  }
}
