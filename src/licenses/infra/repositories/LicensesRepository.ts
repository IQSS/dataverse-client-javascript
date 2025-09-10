import { ApiRepository } from '../../../core/infra/repositories/ApiRepository'
import { ILicensesRepository } from '../../domain/repositories/ILicensesRepository'
import { License } from '../../domain/models/License'
import { transformPayloadToLicenses } from '../../domain/repositories/transformers/licenseTransformers'

export class LicensesRepository extends ApiRepository implements ILicensesRepository {
  private readonly licensesResourceName: string = 'licenses'

  public async getAvailableStandardLicenses(): Promise<License[]> {
    return this.doGet(this.buildApiEndpoint(this.licensesResourceName))
      .then((response) => transformPayloadToLicenses(response))
      .catch((error) => {
        throw error
      })
  }
}
