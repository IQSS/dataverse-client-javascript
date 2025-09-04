import { AxiosResponse } from 'axios'
import { License } from '../../models/License'
import { LicensePayload } from './LicensePayload'

export const transformLicensesResponseToLicenses = (response: AxiosResponse): License[] => {
  const payload = response.data.data as LicensePayload[]
  return payload.map((license: LicensePayload) => ({
    id: license.id,
    name: license.name,
    uri: license.uri,
    iconUrl: license.iconUrl,
    active: license.active,
    isDefault: license.isDefault
  }))
}
