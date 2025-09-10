import { LicensesRepository } from './infra/repositories/LicensesRepository'
import { GetAvailableStandardLicenses } from './domain/useCases/GetAvailableStandardLicenses'

const licensesRepository = new LicensesRepository()

const getAvailableStandardLicenses = new GetAvailableStandardLicenses(licensesRepository)

export { getAvailableStandardLicenses }

export { License } from './domain/models/License'
