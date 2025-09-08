import { AxiosResponse } from 'axios'
import { License } from '../../models/License'
import { LicensePayload } from './LicensePayload'

export const transformPayloadToLicense = (response: AxiosResponse): License[] => {
  const payload = response.data.data as LicensePayload[]

  return payload.map((license: LicensePayload) => ({
    id: license.id,
    name: license.name,
    shortDescription: license.shortDescription,
    uri: license.uri,
    iconUri: license.iconUrl, // in payload, it is called iconUrl, but iconUri is the name matching everywhere else
    active: license.active,
    isDefault: license.isDefault,
    sortOrder: license.sortOrder,
    rightsIdentifier: license.rightsIdentifier,
    rightsIdentifierScheme: license.rightsIdentifierScheme,
    schemeUri: license.schemeUri,
    languageCode: license.languageCode
  }))
}
