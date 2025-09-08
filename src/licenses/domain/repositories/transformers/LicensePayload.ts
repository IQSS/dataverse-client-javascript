export interface LicensePayload {
  id: number
  name: string
  shortDescription?: string
  uri: string
  iconUrl?: string
  active: boolean
  isDefault: boolean
  sortOrder: number
  rightsIdentifier?: string
  rightsIdentifierScheme?: string
  schemeUri?: string
  languageCode?: string
}
