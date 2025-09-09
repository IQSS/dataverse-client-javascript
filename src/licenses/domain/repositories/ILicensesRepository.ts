import { License } from '../models/License'

export interface ILicensesRepository {
  getAvailableStandardLicenses(): Promise<License[]>
}
